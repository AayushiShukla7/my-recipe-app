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
          <!-- <router-link :to="`/recipe/${recipe.slug}`">
            <div>
              <button>View</button>            
            </div>
          </router-link> -->
          <button @click="togglePopupEdit">Edit</button>  
          <button style="margin-left:1rem;" @click="deleteRecipe">Delete</button>
        </div>
      </div>
    </div>

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

    <div class="add-recipe-popup" v-if="popupEdit">
      <div class="popup-content">
        <h2>Edit recipe</h2>

        <!-- Prevent this form to get submitted -->
        <form @submit.prevent="editSelectedRecipe">
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
  </div>
</template>

<script>
//import { ref } from 'vue';  //To get the Reference Composition API component
import { useStore } from 'vuex';

export default {
  name: 'HomeView',
  data() {
    return {
      newRecipe: {
        title: '',
        description: '',
        ingredients: [],
        method: [],
        ingredientRows: 1,
        methodRows: 1
      },
      editRecipe: {
        title: '',
        description: '',
        ingredients: [],
        method: [],
        ingredientRows: 1,
        methodRows: 1
      },
      popupOpen: false,
      popupEdit: false,

    }
  },
  methods: {
    //'.value' is necesary to access the actual value inside a ref object
    togglePopup() {
      this.popupOpen = !this.popupOpen;
    },

    togglePopupEdit() {
      this.popupEdit = !this.popupEdit;
    },

    addNewIngredient() {
      this.newRecipe.ingredientRows++;
    },

    addNewStep() {
      this.newRecipe.methodRows++;
    },

    //Store usage
    addNewRecipe() {
      this.newRecipe.slug = this.newRecipe.title.toLowerCase().replace(/\s/g, '-');

      if(this.newRecipe.slug == '') {
        alert('Please enter a title');
        return;
      }

      this.$store.commit('ADD_RECIPE', { ...this.newRecipe }); //Destructure object before passing
      //this.$store.commit('addRecipe', this.newRecipe);

      //Reset values to what they were originally
      this.newRecipe = {
        title: '',
        description: '',
        ingredients: [],
        method: [],
        ingredientRows: 1,
        methodRows: 1
      };

      this.togglePopup();
    },

    editSelectedRecipe() {
      this.togglePopupEdit();
      $emit('edit', this.editRecipe);
    },

    async deleteRecipe(recipe) {
      console.log('delete', recipe.slug);
      await this.$store.dispatch('deleteRecipe', recipe);
      this.$store.dispatch('getRecipes');
    },
  },
  setup() {
    // const newRecipe = ref({
    //   title: '',
    //   description: '',
    //   ingredients: [],
    //   method: [],
    //   ingredientRows: 1,
    //   methodRows: 1
    // });
    // const popupOpen = ref(false);
    // const popupEdit = ref(false);
    //const store = useStore(); //Gives us access to our store object

    //'.value' is necesary to access the actual value inside a ref object
    // const togglePopup = () => {
    //   popupOpen.value = !popupOpen.value;
    // };
    // const togglePopupEdit = () => {
    //   popupEdit.value = !popupEdit.value;
    // };

    // const addNewIngredient = () => {
    //   newRecipe.value.ingredientRows++;
    // };

    // const addNewStep = () => {
    //   newRecipe.value.methodRows++;
    // };

    // //Store usage
    // const addNewRecipe = () => {
    //   newRecipe.value.slug = newRecipe.value.title.toLowerCase().replace(/\s/g, '-');

    //   if(newRecipe.value.slug == '') {
    //     alert('Please enter a title');
    //     return;
    //   }

    //   store.commit('ADD_RECIPE', { ...newRecipe.value }); //Destructure object before passing

    //   //Reset values to what they were originally
    //   newRecipe.value = {
    //     title: '',
    //     description: '',
    //     ingredients: [],
    //     method: [],
    //     ingredientRows: 1,
    //     methodRows: 1
    //   };

    //   togglePopup();
    // };

    // const editRecipe = () => {
    //   togglePopupEdit();
    //   $emit('edit',recipe);
    // };

    // return {
    //   newRecipe,
    //   togglePopup,
    //   togglePopupEdit,
    //   popupOpen,
    //   addNewIngredient,
    //   addNewStep,
    //   addNewRecipe,
    //   editRecipe
    // };
  },
  created() {
    //this.$store.dispatch('getRecipes');
  },
  computed: {
    recipes() {
      return this.$store.state.recipes;
    }
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
