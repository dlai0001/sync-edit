
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('recipes').del()
    .then(function () {
      // Inserts seed entries
      return knex('recipes').insert([
        {
          id: 1, 
          title: 'Avocado Toast', 
          about: 'A delicious, rich, savory, avocado toast with vinegrette dressing on sour dough.',
          recipeText: `1. Oil your pan with olive oil and heat on high.
          2. As the oil starts smoking, turn the heat down to medium and throw in your slice of toast.
          3. Cook both sides of the toast to a nice golden brown.
          4. Take the toast off the pan and let it cool for 3 minutes.
          5. Peel and slice an avocado.  Layer the avocado slices on the face of the toast.
          6. Pour 1 cup of balsamic vigegar into a sauce plan, and add 3 teaspoons of salt.
          7. Cook the vinegar on low until it reduces to 1/2 of it's original amount.
          8. Drizzle the balsamic vinegret on the toast.
          Enjoy`,
          ownerId:'25795751-b418-480c-a09b-9712069e8b31'
        },        
      ]);
    });
};
