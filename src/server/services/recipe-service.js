
const knex = require('../db');
const uuid = require('uuid/v4');
const yup = require('yup');
const { ValidationError } = require('../errors');

const auditService = require('./audit-service');

const RECIPES_TABLE = 'recipes';

const recipeValidationSchema = yup.object().shape({    
    title: yup.string().min(2, 'Title too short.').required(),
    ownerId: yup.string().required(),
});

class RecipeService {
    async createRecipe(title, about, recipeText, userId) {        

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
                throw new ValidationError({
                    data: {
                        [err.path]: err.errors.join(' '),
                    }
                });
            }
        }

        await knex.insert(newRecipe).into(RECIPES_TABLE);
        auditService.log(userId, 'CREATED_RECIPE', id);

        return newRecipe;
    }
}


module.exports = new RecipeService();