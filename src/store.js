import Vuex from 'vuex'

import idb from '@/api/IndexedDBService';

export default new Vuex.Store({
  state: {
    recipes:[]
  },
  mutations: {

  },
  actions: {
    async deleteRecipe(recipe) {
        console.log('store is being asked to delete ' + recipe.id);
        await idb.deleteRecipe(recipe.id); 
      },
  
      async getRecipes() {
        this.state.recipes = [];
        let recipesIDB = await idb.getRecipes();

        recipesIDB.forEach(r => {
          this.state.recipes.push(r);
        });
      },
  
      async saveRecipe(recipe) {
        await idb.saveRecipe(recipe);
      }
  }
})