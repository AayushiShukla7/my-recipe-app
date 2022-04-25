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
//import { stringifyQuery } from 'vue-router';
//import { ref } from 'vue';  //To get the Reference Composition API component
import { useStore } from 'vuex';
// import { idb } from '@/api/idb'

const DB_NAME = 'recipedb';
const DB_VERSION = 1;

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
      db:null,
      ready:false,
      addDisabled:false,
      //recipes: [],
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
      this.newRecipe.ingredientRows++;
    },

    addNewStep() {
      this.newRecipe.methodRows++;
    },

    // async getDb() {
    //   return new Promise((resolve, reject) => {	
    //   let request = window.indexedDB.open(DB_NAME, DB_VERSION);
      
    //   request.onerror = e => {
    //     console.log('Error opening db', e);
    //     reject('Error');
    //   };
    
    //   request.onsuccess = e => {
    //     resolve(e.target.result);
    //   };
      
    //   request.onupgradeneeded = e => {
    //     console.log('onupgradeneeded');
    //     let db = e.target.result;
    //     let objectStore = db.createObjectStore("recipes", { autoIncrement: true, keyPath:'id' });
    //   };
    //   });
    // },

    // async getRecipesFromDb() {
    //   return new Promise((resolve, reject) => {
    
    //     let trans = this.db.transaction(['recipes'],'readonly');
    //     trans.oncomplete = e => {
    //       resolve(recipes);
    //     };
        
    //     let store = trans.objectStore('recipes');
    //     let recipes = [];
        
    //     store.openCursor().onsuccess = e => {
    //       let cursor = e.target.result;
    //       if (cursor) {
    //         recipes.push(cursor.value)
    //         cursor.continue();
    //       }
    //     };
    
    //   });
    // },

    // async addRecipe() {
    //   this.addDisabled = true;
    //   // random recipe for now
    //   let recipesFromStore = this.$store.state
    //   console.log('about to add '+JSON.stringify(recipe));
    //   await this.addRecipeToDb(recipe);
    //   this.recipes = await this.getRecipesFromDb();
    //   this.addDisabled = false;      
    // },

    // async addRecipeToDb(recipe) {
    //   return new Promise((resolve, reject) => {
    
    //   let trans = this.db.transaction(['recipes'],'readwrite');
    //   trans.oncomplete = e => {
    //     resolve();
    //   };
    
    //   let store = trans.objectStore('recipes');
    //   store.add(recipe);
    
    //   });
    // },

    // async deleteRecipe(id) {
    //   await this.deleteRecipeFromDb(id);
    //   this.recipes = await this.getRecipesFromDb();      
    // },

    // async deleteRecipeFromDb(id) {
    //   return new Promise((resolve, reject) => {
    //   let trans = this.db.transaction(['recipes'],'readwrite');
    //   trans.oncomplete = e => {
    //     resolve();
    //   };
    
    //   let store = trans.objectStore('recipes');
    //   store.delete(id);
    //   });
    // },
  },
  computed: {
    recipes: function() {
      return this.$store.getters.getRecipes;
    }
  },
  created() {
    //this.$store.dispatch('getRecipes');

    // this.db = await this.getDb();
    // this.recipes = await this.getRecipesFromDb();
    // this.ready = true;
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
