import { createStore } from 'vuex'

export default createStore({
  state: {
    recipes: [
      {
        slug: 'kadhi-pakoda',
        title: 'Kadhi Pakoda',
        description: 'A delicious and super-easy yogurt-based thick creamy curry made with only 4 ingredients. Top it off with a spoonfull of ghee and you are good to go! Best paired with steamed plain brown/white rice.',
        ingredients: [
          '1 cup sour full fat curd',
          '2 cups water',
          '3 to 4 tablespoons besan (gram flour)',
          '½ teaspoon turmeric powder',
          'salt as required',
          '¼ teaspoon fenugreek seeds (methi dana)',
          'a generous pinch of asafoetida (hing)',
          '2 dry red chilies - kept whole or halved',
          '2 green chillies',
          '4 to 5 cloves of peeled garlic',
          'oil for frying pakodas'
        ],
        method: [
          'Mix the above mentioned kadhi ingredients including salt, till smooth in a pan. Use a wired whisk to stir. No lumps should be there.',
          'Keep on a low flame and stirring at intervals simmer and cook for  12 to 15 minutes till the gram flour or besan gets cooked and the kadhi thickens a bit.',
          'Cook until the consistency of the kadhi is neither thick nor thin.',
          'Keep aside covered.',
          'Prepare the tempering in ghee. Immediately pour this tempering into the kadhi.',
          'Cover and let the tempering flavors infuse with the kadhi.',
          'After 5 to 6 mins, stir and serve rajasthani kadhi hot with phulkas, steamed rice or jeera rice.'
        ]
      },
      {
        slug: 'besan-halwa',
        title: 'Besan Halwa',
        description: 'A sweet and nutty dessert made with gram flour, dried fruits and nuts, sugar and oodles of ghee(clarified butter).',
        ingredients: [
          '¼ cup Ghee (clarified butter)',
          '1 cup besan (gram flour or chickpea flour)',
          '1.5 cups milk',
          '⅓ cup sugar',
          '¼ teaspoon cardamom powder',
          '4 to 5 pistachios ,slivered or chopped',
          '4 to 5 almonds , slivered or chopped',
          'handful of raisins',
          'few strands of saffron – optional'
        ],
        method: [
          'Add ghee in a heavy bottom pan.',
          'Once the ghee is melted, add chickpea flour and fry on medium heat until browned and a nutty aroma starts to come from it. It will take 10-12 minutes. Keep stirring continuously to avoid the flour from burning at the bottom of the pan.',
          'Once the chickpea flour is browned well, add 1 cup water and ½ cup milk to the pan and cook until the liquid is absorbed by the flour. Keep stirring continuously.',
          'Add ½ cup sugar and 1 teaspoon cardamom powder to the pan. Mix well and cook for 5-6 minutes on low heat until ghee starts to separate from the sides of the pan.',
          'Once done, garnish with  raisins, almond and pistachio slivers and serve hot.'
        ]
      }
    ]
  },
  getters: {
  },
  mutations: {
    ADD_RECIPE (state, recipe) {
      state.recipes.push(recipe);
    }
  },
  actions: {
  },
  modules: {
  }
})
