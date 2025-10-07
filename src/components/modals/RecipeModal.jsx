import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const RecipeModal = ({ recipe, onClose }) => {
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <div className="modal-grid">
          {/* Recipe Image */}
          <div className="modal-image-section">
            <img src={recipe.image} alt={recipe.title} />
          </div>

          {/* Recipe Details */}
          <div className="modal-details-section">
            <div className="modal-header-content">
              <span className="recipe-icon-large">{recipe.icon}</span>
              <div>
                <h2>{recipe.title}</h2>
                <p className="recipe-meta">
                  <time>{recipe.day} - {recipe.date}</time>
                </p>
              </div>
            </div>

            <div className="recipe-content">
              {/* If recipe has markdown text, display it */}
              {recipe.recipe && (!recipe.ingredients || recipe.ingredients.length === 0) ? (
                <section className="recipe-section">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {recipe.recipe}
                  </ReactMarkdown>
                </section>
              ) : (
                <>
                  {/* Ingredients */}
                  <section className="recipe-section">
                    <h3>Ingredienser:</h3>
                    {recipe.ingredients && recipe.ingredients.map((section, idx) => (
                      <div key={idx} className="ingredient-group">
                        <h4>{section.section}</h4>
                        <ul>
                          {section.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </section>

                  {/* Instructions */}
                  <section className="recipe-section">
                    <h3>Instruktioner:</h3>
                    <ol className="instructions-list">
                      {recipe.instructions && recipe.instructions.map((step, idx) => (
                        <li key={idx}>
                          <strong>{step.title}</strong>
                          <ul>
                            {step.steps.map((substep, i) => (
                              <li key={i}>{substep}</li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ol>
                  </section>

                  {/* Final note */}
                  {recipe.finalNote && (
                    <div className="recipe-note">
                      <strong>{recipe.finalNote}</strong>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
