const DB_NAME = 'recipedb';
const DB_VERSION = 1;
let objectStore;
let recipes = [];

export const IndexedDBService = {

	async getDb() {
		var shouldInitDb = true;

		return new Promise((resolve, reject) => {
			console.log('OPENING DB');	
			let request = window.indexedDB.open(DB_NAME, DB_VERSION);			
			
			request.onerror = e => {
				console.log('Error opening db', e);
				reject('Error');
			};
		
			request.onsuccess = e => {				
				resolve(e.target.result);				
			};
			
			request.onupgradeneeded = e => {
				console.log('onupgradeneeded');
				let db = e.target.result;
				objectStore = db.createObjectStore("recipes", { keyPath:'slug' });
				//objectStore = db.createObjectStore("recipes", { autoIncrement: true, keyPath:'id' });
				objectStore.createIndex("slug", "slug", {unique: true});	
				
				if(shouldInitDb) { 	//executes only if DB init happened
					this.db_Populate();	//close the db first and then call init
					this.shouldInitDb = false;
				}
			};
		});
	},

	db_Populate() {
		//Initialize the store with default values
		let defRecipes = [
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
		];

		defRecipes.forEach(r => {
			this.addRecipe(r);
		});
	},

	async getRecipes() {
		let db = await this.getDb();

		return new Promise((resolve, reject) => {
	
			let trans = db.transaction(['recipes'],'readwrite');
			trans.oncomplete = e => {
				resolve(recipes);
			};
			
			let store = trans.objectStore('recipes');	
			recipes = [];		
			
			store.openCursor().onsuccess = e => {
				let cursor = e.target.result;				
				
				if (cursor) {
					recipes.push(cursor.value);					
					cursor.continue();
				}
			};
		});
	},

	// async addRecipe(recipe) {
	// 	//alert('Inside IDB addRecipe method - ' + JSON.stringify(recipe));
	// 	this.addDisabled = true;
	// 	await this.addRecipeToDb(recipe);
	// 	this.recipes = await this.getRecipes();
	// 	this.addDisabled = false;      
	// },

	async addRecipe(recipe) {
		let db = await this.getDb();
		this.addDisabled = true;

		return new Promise((resolve, reject) => {
	
		let trans = db.transaction(['recipes'],'readwrite');
		trans.oncomplete = e => {
			resolve();
		};
	
		let store = trans.objectStore('recipes');
		store.add(recipe);

		this.addDisabled = false; 
	
		});
	},

	async deleteRecipe(slug) {
		alert('deleteRecipe: Slug --> ' + slug)
		await this.deleteRecipeFromDb(slug);
		this.recipes = await this.getRecipes();      
	},

	async deleteRecipeFromDb(slug) {
		let db = await this.getDb();

		return new Promise((resolve, reject) => {
		let trans = db.transaction(['recipes'],'readwrite');
		trans.oncomplete = e => {
			resolve();
		};
	
		let store = trans.objectStore('recipes');
		store.delete(slug);
		});
	},

	async saveRecipe(recipe) {
		await this.saveRecipeToDb(recipe);
		this.recipes = await this.getRecipes();
	},

	async saveRecipeToDb(recipe) {
		let db = await this.getDb();

		return new Promise((resolve, reject) => {
		let trans = db.transaction(['recipes'],'readwrite');
		trans.oncomplete = e => {
			resolve();
		};
	
		let store = trans.objectStore('recipes');
		recipe = JSON.parse(JSON.stringify(recipe));
		store.put(recipe);
		});
	},
};

export default IndexedDBService;