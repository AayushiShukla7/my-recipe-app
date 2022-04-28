<template>
  <div class="recipe">
      <div class="space-between">
        <router-link to="/">&lt; Back</router-link>
        <!-- <button type="button" @click="isEditing = !isEditing" v-if="!isEditing">Inline Edit</button>         -->
      </div>

      <div class="align-right">
        <button type="button" @click="save" v-if="isEditing">Save</button> &nbsp;
        <button type="button" v-if="isEditing" @click="isEditing = false">Cancel</button>
      </div>

      <h1>{{ recipe.title }}</h1>
      <p class="desc" v-if="!isEditing">{{ recipe.description }}</p>
      <textarea v-model="recipe.description" ref="recipe_desc" v-if="isEditing"></textarea>
      <hr />

      <div class="ingredients">
        <!-- List the Ingredients of the selected Recipe -->
        <h3>Ingredients</h3>
        <ul v-if="!isEditing">
          <li v-for="(ingredient, i) in recipe.ingredients" :key="i">
            {{ ingredient }}
          </li>
        </ul>
        <div v-if="isEditing">
          <table>
            <tr v-for="(ingredient, i) in recipe.ingredients" :key="i">
              <td width="5%" style="padding-top: 5px;">
                <label>{{ i + 1 }} - </label> 
              </td>
              <td width="95%">
                <input v-model="recipe.ingredients[i]" ref="recipe_ingrdnts" />
              </td>
            </tr>
          </table>
        </div>
      </div>

      <div class="method">
        <h3>Method</h3>
        <ol v-if="!isEditing">
          <li v-for="(step, i) in recipe.method" :key="i">
            <!-- This won't allow new lines in a single step! -->
            <!-- {{ step }} -->

            <!--  This would -->
            <span v-html="cleanText(step)"></span>
          </li>
        </ol>
        <div v-if="isEditing">
          <table>
            <tr v-for="(step, i) in recipe.method" :key="i">
              <td width="5%" style="padding-top: 5px;">
                <label>{{ i + 1 }} - </label> 
              </td>
              <td width="95%">
                <textarea v-model="recipe.method[i]" ref="recipe_step" style="overflow:auto;"></textarea>
              </td>
            </tr>
          </table>
        </div>
      </div>
  </div>
</template>

<script>
export default {
    name: 'Recipe',
    data() {
      return {
        isEditing: false
      }
    },
    computed:{
      recipe() {
        //Demo of Options API
        return this.$store.state.recipes.find(recipe => recipe.slug === this.$route.params.slug);
      }
    },
    methods: {
      cleanText(text) {
        return text.replace(/\n/g, '<br />');
      },

      async save() {
        this.recipe.description = this.$refs['recipe_desc'].value;
        
        await this.saveRecipe(this.recipe);
        this.isEditing = !this.isEditing;
      },

      editIngredient: function(){
          this.recipe.ingredient = this.$refs['recipe_ingrdnts'].value;
          this.isEditing = !this.isEditing;
      },

      cancelEditIngredient: function(){
          this.isEditing = !this.isEditing;
      },

      //IndexedDB Save
      async saveRecipe(editedRecipe) {
        if(this.editedRecipe.slug !== "") {
          console.info('Saving Recipe - ' + JSON.stringify(editedRecipe));

          await this.$store.dispatch("saveRecipe", editedRecipe);
          //this.$store.dispatch('getRecipes');
        }
      },
    }
}
</script>

<style scoped>
.recipe {
	padding: 1rem;
	max-width: 768px;
	margin: 0 auto;
}

.desc {
	font-size: 1.125rem;
	line-height: 1.4;
	margin-bottom: 1rem;
}

hr {
	margin-bottom: 1rem;
}

h3 {
	margin-bottom: 1rem;
}

.ingredients {
	padding: 1rem;
	background-color: #081c33;
	border-radius: 0.5rem;
	margin-bottom: 2rem;
}

.ingredients ul li {
	list-style-position: inside;
	line-height: 1.4;
	margin-bottom: 1rem;
}

.method ol li {
	margin-bottom: 2rem;
	padding-bottom: 1rem;
	list-style-position: inside;
	border-bottom: 1px solid #EEE;
}

.space-between {
  display: flex;
  justify-content: space-between;
}

.align-right {
  display: flex;
  justify-content: flex-end;
}

input,
textarea {
  display: block;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 1rem;
}

textarea {
  height: 100px;
  resize: none;
}

table {
  min-width: 100%;
  max-width: 100%;
}

td {
  vertical-align: top;
}
</style>