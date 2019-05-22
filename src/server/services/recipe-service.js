class RecipeService {
    async createRecipe(title, about, recipeText, userId) {
        return {
            id: 1,
            about: about,
            recipeText: recipeText,
            ownerId: userId,
        }
    }
}


module.exports = new RecipeService();