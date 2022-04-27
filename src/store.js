import Vuex from 'vuex'

import idb from '@/api/IndexedDBService';

export default new Vuex.Store({
  state: {
    recipes:[]
  },
  mutations: {

  },
  actions: {    
    //Fetch all recipes in IndexedDB
    async getRecipes(context) {
      this.state.recipes = [];
      let recipesIDB = [];
      recipesIDB = await idb.getRecipes();

      recipesIDB.forEach(r => {
        this.state.recipes.push(r);
      });
    },

    //Add new recipe to IndexedDB
    async addRecipe(recipe) {
      await idb.addRecipe(recipe);
    },

    //Save edited recipe to IndexedDB
    async saveRecipe(context, recipe) {
      await idb.saveRecipe(recipe);
    },

    //Delete a recipe from IndexedDB
    async deleteRecipe(context, recipe) {
      console.log('store is being asked to delete ' + recipe.slug);
      await idb.deleteRecipe(recipe.slug); 
    },
  }
})