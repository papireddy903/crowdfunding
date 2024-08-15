import React, { useState } from 'react';
import data from './faq_data.js';
import '../faqs.css'

const Faqs = () => {
  const [selected, setSelected] = useState(null);

  const handleClick = (id) => {
    if (selected === id) {
      setSelected(null); 
    } else {
      setSelected(id); 
    }
  };

  return (
    <div>
      {data && data.length > 0 ? (
        data.map((dataItem) => (
          <div className="item" key={dataItem.id}>
            <div
              className="display-title"
              onClick={() => handleClick(dataItem.id)}
            >
              <div class='question-box'>
              <h3 className="question">{dataItem.question}</h3>
              <span className="plus">{selected === dataItem.id ? '-' : '+'}</span>
              </div>
        
              {selected === dataItem.id && (
              <div className="content">{dataItem.answer}</div>
            )}
            </div>

            
          </div>
        ))
      ) : (
        <p>No FAQs available.</p>
      )}
    </div>
  );
};

export default Faqs;
