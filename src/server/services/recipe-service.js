
const knex = require('../db');
const uuid = require('uuid/v4');
const yup = require('yup');
const { ValidationError, UnauthorizedError } = require('../errors');

const RECIPES_TABLE = 'recipes';

const recipeValidationSchema = yup.object().shape({
    title: yup.string().min(2, 'Title too short.').required(),
});

class RecipeService {
    async createRecipe(title, about, recipeText, userId) {
        if(!userId) {
            throw new UnauthorizedError('Must be logged in to create recipe.');
        }

        const id = uuid();
        const newRecipe = {
            id,
            title,
            about,
            recipeText,
            ownerId:userId,
        };
        
        try {
            await recipeValidationSchema.validate(newRecipe);
        } catch(err) {
            if(err instanceof yup.ValidationError) {
                debugger;
                throw new ValidationError({
                    data: {
                        [err.path]: err.errors.join(' '),
                    }
                });
            }
        }


        await knex.insert(newRecipe).into(RECIPES_TABLE);

        return newRecipe;
    }
}


module.exports = new RecipeService();