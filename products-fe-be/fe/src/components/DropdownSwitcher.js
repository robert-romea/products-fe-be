import React, { useEffect, useState } from 'react';
import "../styles/dropdownSwitcher.scss"


function DropdownSwitcher(props) {
  const [selectedElement, setSelectedElement] = useState('el1');

  const handleElementChange = (event) => {
    setSelectedElement(event.target.value);
  };

  useEffect(() => {
    console.log(props);
     
  }, []);

  const renderForm = () => {
    switch (selectedElement) {
      case 'dvd':
        return (
            <div className="sku-input">
            <label
                htmlFor="size"
              className=""
            >
              Size (MB)
            </label>
            <div className="">
              <input
                required
                type="text"
                id="size"
                className=""
                onChange={props.handlers.size}
              />
            </div>
          </div>
        )
        
        ;
      case 'furniture':
        return (
            <div className="furniture-input-fields">
            {/* SKU input */}
            <div className="sku-input">
              <label
                  htmlFor="height"
                className=""
              >
                Height (CM)
              </label>
              <div className="">
                <input
                  required
                  type="text"
                  id="height"
                  className=""
                  onChange={props.handlers.height}
                />
              </div>
            </div>
  
            {/* name input */}
            <div className="name-input">
              <label
                htmlFor="width"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Width (CM)
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <input
                  required
                  type="text"
                  id="width"
                  className=""
                  onChange={props.handlers.width}
                />
              </div>
            </div>
  
            {/* price input */}
            <div className="price-input">
              <label
                htmlFor="length"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
               Length (CM)
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <input
                  required
                  type="text"
                  id="length"
                  className=""
                  onChange={props.handlers.length}
                />
              </div>
            </div>
       
          
  
          </div>
        );
      case 'book':
        return(
            <div className="book-input">
            <label
                htmlFor="book"
              className=""
            >
              Weight(KG)
            </label>
            <div className="">
              <input
                required
                type="text"
                id="book"
                className=""
                onChange={props.handlers.weight}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className='dropdown-switcher-forms'>
      <label htmlFor="element-select">Type switcher</label>
      <select id="element-select" value={selectedElement} onChange={handleElementChange}>
        <option value="el1">Please, select an element</option>
        <option value="dvd">DVD </option>
        <option value="furniture">Furniture </option>
        <option value="book">Book </option>
      </select>
      <div className='switcher-forms'>
        {renderForm()}
      </div>
      
    </div>
  );
}

export default DropdownSwitcher;
