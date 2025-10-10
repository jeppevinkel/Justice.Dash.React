import React from 'react';

const RecipeList = ({ onRecipeClick, recipes = [] }) => {
  return (
    <ul className="recipe-list">
      {recipes.slice(0, 8).map(recipe => (
        <li
          key={recipe.id}
          className="recipe-item"
          onClick={() => onRecipeClick(recipe)}
        >
          <span className="recipe-icon">{recipe.icon}</span>
          <div className="recipe-details">
            <h3>{recipe.title}</h3>
            <time>{recipe.day} - {recipe.date}</time>
          </div>
          <svg className="recipe-arrow" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/>
          </svg>
        </li>
      ))}
    </ul>
  );
};

export default RecipeList;
