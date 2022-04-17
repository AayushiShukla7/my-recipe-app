<template>
  <div class="home">
    <h1>My Recipes</h1>
    <button>Add new Recipe</button>

    <div class="recipes">
      <!-- TODO: Recipes to go here! -->
    </div>

    <div class="add-recipe-popup">
      <div class="popup-content">
        <h2>Add new recipe</h2>

        <!-- Prevent this form to get submitted -->
        <form @submit.prevent="">
          <div class="group">
            <label>Title</label>
            <input type="text" />
          </div>

          <div class="group">
            <label>Description</label>
            <textarea></textarea>
          </div>

          <div class="group">
            <label>Ingredients</label>
            <div class="ingredients">
              <input type="text" />
            </div>
            <button type="button">Add Ingredient</button>
          </div>          

          <div class="group">
            <label>Method</label>
            <div class="method">
              <textarea></textarea>
            </div>
            <button type="button">Add Step</button>
          </div>

          <button type="submit">Add Recipe</button>
          <button type="button">Close</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
}
</script>

<style>
.home {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
