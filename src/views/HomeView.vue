<template>
  <div class="home">
    <h1>My Recipes</h1>
    <button @click="togglePopup">Add new Recipe</button>

    <div class="recipes">
      <div class="card" v-for="recipe in recipes" :key="recipe.slug">
        <router-link :to="`/recipe/${recipe.slug}`">
            <div class="title">
              <h2 title="Click on the title to view the complete recipe">{{ recipe.title }}</h2> 
            </div>
          </router-link>
        <p>{{ recipe.description }}</p>
        <div class="row-content">
          <button @click="editSelectedRecipe(recipe)">Edit</button>  
          <button style="margin-left:1rem;" @click="deleteRecipe(recipe)">Delete</button>
        </div>
      </div>
    </div>

    <!-- ADD NEW RECIPE - START -->
    <div class="add-recipe-popup" v-if="popupOpen">
      <div class="popup-content">
        <h2>Add new recipe</h2>

        <!-- Prevent this form to get submitted -->
        <form @submit.prevent="addNewRecipe">
          <div class="group">
            <label>Title</label>
            <input type="text" v-model="newRecipe.title" />
          </div>

          <div class="group">
            <label>Description</label>
            <textarea v-model="newRecipe.description"></textarea>
          </div>

          <div class="group">
            <label>Ingredients</label>
            <div class="ingredients" v-for="i in newRecipe.ingredientRows" :key="i">
              <input type="text" v-model="newRecipe.ingredients[i - 1]" />
            </div>
            <button type="button" @click="addNewIngredient">Add Ingredient</button>
          </div>          

          <div class="group">
            <label>Method</label>
            <div class="method" v-for="i in newRecipe.methodRows" :key="i">
              <textarea v-model="newRecipe.method[i - 1]"></textarea>
            </div>
            <button type="button" @click="addNewStep">Add Step</button>
          </div>

          <button type="submit">Add Recipe</button>
          <button type="button" @click="togglePopup">Close</button>
        </form>
      </div>
    </div>
    <!-- ADD NEW RECIPE - END -->

    <!-- EDIT RECIPE - START -->
    <div class="edit-recipe-popup" v-if="popupEdit">
      <div class="popup-content">
        <h2>Edit recipe</h2>

        <!-- Prevent this form to get submitted -->
        <form @submit.prevent="saveRecipe">
          <div class="group">
            <label>Title</label>
            <input type="text" v-model="editRecipe.title" />
          </div>

          <div class="group">
            <label>Description</label>
            <textarea v-model="editRecipe.description"></textarea>
          </div>

          <div class="group">
            <label>Ingredients</label>
            <div class="ingredients" v-for="i in editRecipe.ingredientRows" :key="i">
              <input type="text" v-model="editRecipe.ingredients[i - 1]" />
            </div>
            <button type="button" @click="addNewIngredient">Add Ingredient</button>
          </div>          

          <div class="group">
            <label>Method</label>
            <div class="method" v-for="i in editRecipe.methodRows" :key="i">
              <textarea v-model="editRecipe.method[i - 1]"></textarea>
            </div>
            <button type="button" @click="addNewStep">Add Step</button>
          </div>

          <button type="submit">Save Changes</button>
          <button type="button" @click="togglePopupEdit">Close</button>
        </form>
      </div>
    </div>
    <!-- EDIT RECIPE - END -->

  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      newRecipe: {
        title: '',
        slug: '',
        description: '',
        ingredients: [],
        method: [],
        ingredientRows: 1,
        methodRows: 1
      },
      editRecipe: {
        title: '',
        slug: '',
        description: '',
        ingredients: [],
        method: [],
        ingredientRows: 1,
        methodRows: 1
      },
      popupOpen: false,
      popupEdit: false,
      db:null,
      ready:false,
      addDisabled:false,
    }
  },
  methods: {
    togglePopup() {
      this.popupOpen = !this.popupOpen;
    },

    togglePopupEdit() {
      this.popupEdit = !this.popupEdit;
    },

    addNewIngredient() {
      if(this.popupEdit)
        this.editRecipe.ingredientRows++;
      else if(this.popupOpen) 
        this.newRecipe.ingredientRows++;
    },

    addNewStep() {
      if(this.popupEdit)
        this.editRecipe.methodRows++;
      else if(this.popupOpen) 
        this.newRecipe.methodRows++;
    },

    async addNewRecipe() {
      this.newRecipe.slug = this.newRecipe.title.toLowerCase().replace(/\s/g, '-');
      console.info('Adding Recipe - ' + JSON.stringify(this.newRecipe));

      await this.$store.dispatch("addRecipe", this.newRecipe);
      this.$store.dispatch('getRecipes');
      
      //Empty the newRecipe value and close the popup.
      this.newRecipe = [];
      this.togglePopup();
    },

    async saveRecipe() {
      if(this.editRecipe.slug !== "") {
        console.info('Saving Recipe - ' + JSON.stringify(this.editRecipe));

        await this.$store.dispatch("saveRecipe", this.editRecipe);
        this.$store.dispatch('getRecipes');
        
        //Empty the editRecipe value and close edit the popup.
        this.editRecipe = [];
        this.togglePopupEdit();
      }
    },

    async deleteRecipe(recipe) {
      await this.$store.dispatch('deleteRecipe', recipe);
      this.$store.dispatch('getRecipes');
    },

    editSelectedRecipe(recipe) {
      this.editRecipe.slug = recipe.slug;
      this.editRecipe.title = recipe.title;
      this.editRecipe.description = recipe.description;
      this.editRecipe.ingredients = recipe.ingredients;
      this.editRecipe.ingredientRows = recipe.ingredients.length;
      this.editRecipe.method = recipe.method;
      this.editRecipe.methodRows = recipe.method.length;

      console.log("Edited recipe - " + JSON.stringify(this.editRecipe));
      this.togglePopupEdit();
    }
  },
  computed: {
    recipes: function() {
      return this.$store.state.recipes;
    }
  },
  created() {
    this.$store.dispatch('getRecipes');
  },
}
</script>

<style>
.home {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  font-size: 3rem;
  margin-bottom: 32px;
}

.recipes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  /* display: flex;
  flex-direction: row; */
}

.recipes .card {
  padding: 1rem;
  border-radius: 5px;
  margin: 1rem;
  background-color: #081c33;
}

.recipes .card h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.recipes .card p {
  font-size: 1.125rem;
  line-height: 1.4;
  margin-bottom: 1rem;
}

.add-recipe-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-recipe-popup .popup-content {
  background-color: #081c33;
  padding: 2rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 768px;
}

.edit-recipe-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
}

.edit-recipe-popup .popup-content {
  background-color: #081c33;
  height: 80%;
  overflow: auto;
  padding: 2rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 768px;
}

.popup-content h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.popup-content .group {
  margin-bottom: 1rem;
}

.popup-content .group label {
  display: block;
  margin-bottom: 0.5rem;
}

.popup-content .group input,
.popup-content .group textarea {
  display: block;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 1rem;
}

.popup-content .group textarea {
  height: 100px;
  resize: none;
}

.popup-content button[type="submit"] {
  margin-right: 1rem;
}

.row-content {
  display: flex;
  flex-direction: row;
}
</style>
