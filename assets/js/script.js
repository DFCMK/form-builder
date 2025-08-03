const draggables = document.querySelectorAll('.draggable');
const formBuilder = document.getElementById('form-builder');
let submitButton;

draggables.forEach(draggable => {
  draggable.addEventListener('dragstart', dragStart);
  draggable.addEventListener('dragend', dragEnd);
});

function handleSubmit(){
    const formData = [];

    Array.form(formBuilder.children).forEach((child) =>{
        if((child.classList.contains('bigHeadDiv') && child.querySelector('.bigHeadInput')) || 
        child.classList.contains('smallHeadDiv') && child.querySelector('.smallHeadInput') ||
        child.classList.contains('paragraphDiv') && child.querySelector('.paragraphInput')

    ){
        let label = '';
        let elementType = '';

        if (child.querySelector('bigHeadInput')){
            label = child.querySelector('.bigHeadInput').value;
            elementType = 'bigHead';
        }
        if (child.querySelector('smallHeadInput')){
            label = child.querySelector('.smallHeadInput').value;
            elementType = 'samllHead';
        }
        if (child.querySelector('paragraphInput')){
            label = child.querySelector('.pragraphInput').value;
            elementType = 'paragraphInput';
        }

        formData.push({
            value: label,
            type: elementType
        })

        localStorage.setItem('formData', JSON.stringify(formData));

        window.location.href = 'index.html';
    }

    if(child.classList.contains('textInputDiv') || child.classList.contains('textAreaDiv')){
        const label = child.querySelector('.label-edit').value;
        let elementType = '';

        if(child.classList.contains('textInputDiv')) elementType = 'textInput'
        if(child.classList.contains('textAreaDiv')) elementType = 'textArea'
        formData.push({
            value: label,
            type: elementType
        })
    }

    if(child.classList.contains('SelectDiv') ||
    child.classList.contains('RadioDiv') ||
    child.classList.contains('CheckBoxDiv')){
        
        const label = child.querySelector('.label-edit').value;
        const optionValues = [];

        const AllOptionsList = child.queryselector('.options-container');
        const options = AllOptionsList.querySelectorAll('.option-edit');

        options.forEach(option => {
            const optionValue = option.querySelector('input').value;
            optionValues.push(optionValue);
        })

        let elementType = '';
        if (child.classList.contains('SelectDiv')) elementType='select';
        else if(child.classList.contains('RadioDiv')) elementType = 'radio';
        else if(child.classList.contains('CheckBoxDiv')) elementType = 'checkBox'
        formData.push({
            value: label,
            type: elementType,
            options: optionValues
        })
    }
    })
}

function makeElementDraggable(element) {
  element.addEventListener('dragstart', dragStart);
  element.addEventListener('dragend', dragEnd);
  element.setAttribute('draggable', true);
}

formBuilder.addEventListener('dragover', dragOver);
formBuilder.addEventListener('drop', drop);
formBuilder.addEventListener('dragleave', () => {
  formBuilder.classList.remove('drag-active');
});

function dragStart(e) {
  e.dataTransfer.setData('draggedElementId', e.target.id);
  e.target.classList.add('dragging');
}

function dragEnd(e) {
  e.target.classList.remove('dragging');
}

function dragOver(e) {

  e.preventDefault();
  const afterElement = getDragAfterElement(formBuilder, e.clientY);
  const draggable = document.querySelector(".dragging");

  if(afterElement == null){
    formBuilder.appendChild(draggable);
    toggleSubmitButton();
  }else{
    formBuilder.insertBefore(draggable, afterElement);
    toggleSubmitButton();
  }
}

function getDragAfterElement(container, y){
    const draggableElements = [...container.querySelectorAll('.form-element:not(.dragging)')];

    return draggableElements.reduce((closest, child)=>{

        // Gets elements position and dimension
        const box = child.getBouningClientReact();

        const offset = y -box.top -box.height/2;

        if(offset < 0 && offset > closest.offset){
            return {offset:offset, element : child}
        }else{
            return closest;
        }
    }, {offset : Number.NEGATIVE_INFINITY}).element
}

function drop(e){
    e.preventDefault();
    const type = e.dataTransfer.getData('type');

    let newElement;
    switch(type){
        case 'big-heading':
            newElement = createText('bigHead');
            break;
        case 'small-heading':
            newElement = createText('smallHead');
            break;
        case 'paragraph':
            newElement = createText('paragraph');
            break;
        case 'textinput':
            newElement = createEditableTextInput('textInpt');
        case 'textarea':
            newElement = createEditableTextArea('textArea');
        case 'select':
            newElement = createEditableMCQ('select');
        case 'radio':
            newElement = createEditableMCQ('radio');
        case 'checkbox':
            newElement = createEditableMCQ('checkboxt');
        default:
            newElement = createText();
    }

    if (newElement){
        formBuilder.appendChild(newElement);
        makeElementDraggable(newElement);
        toggleSubmitButton();
    }
}

function createText(type){
    const div = document.createElement('div');
    div.setAttribute('draggable', true);
    div.classList.add(`${type}Div`);

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.classList.add(`${type}Input`);
    labelInput.value = '--change this Big Heading-';

    if(type == 'smallHead') labelInput.value = '--Change this Small Heading-';
    if(type == 'Paragraph') labelInput.value = '--Change this Paragraph-';

    div.appendChild(labelInput);

    const deleteButton = createDeleteButton();
    div.appendChild(deleteButton);

    return div;
}


function createEditableTextInput(type){
    let divname = 'textInputDiv';

    if(type == 'textArea'){
        divname = 'textAreaDiv';
    }else{
        divname = 'textInputDiv';
    }

    const div = document.createElement('div');
    div.setAttribute('draggable', true);
    div.classList.add('form-element', divname);

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.classList.add('label-edit');
    labelInput.value = 'edit this' + type + 'label';

    const inputElement = document.createElement('input');
    if(type == 'textArea'){
        inputElement = document-createElement('textarea');
    }


    inputElement.placeholder = 'Sample Filed (non-editable)';

    div.appendChild(labelInput);
    div.appendChild(inputElement);
    const deleteButton = createDeleteButton();
    div.appendChild(deleteButton);
    return div;
}

function createEditableTextArea(){
    const div = document.createElement('div');
    div.setAttribute('draggable', true);
    div.classList.add('form-element', 'textAreaDiv');

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.classList.add('label-edit');
    labelInput.value = 'Text Area Label';

    const inputElement = document.createElement('textarea');
    inputElement.placeholder = 'Sample Filed (non-editable)';

    div.appendChild(labelInput);
    div.appendChild(inputElement);
    const deleteButton = createDeleteButton();
    div.appendChild(deleteButton);
    return div;
}

function createEditableMCQ(type){

  let divname = 'SelectDiv';
  if(type == 'radio') divname = 'RadioDiv';
  if(type == 'checkbox') divname = 'CheckboxDiv';
  const div = document.createElement('div');
  div.setAttribute('draggable', true);
  div.classList.add('form-element', 'SelectDiv');

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.classList.add('label-edit');
    labelInput.value =  'edit this' + type + 'label';

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('option-container');

    const option1 = createOption('Option 1');
    const option2 = createOption('Option 2');

    optionsContainer.appendChild(option1);
    optionsContainer.appendChild(option2);

    const addOptionButton = document.createElement('button');
    addOptionButton.type = 'button';
    addOptionButton.textContent = 'Add option';

    addOptionButton.textContent = 'Add Option';

    addOptionButton.onclick = () => {
      const newOption = createOption(`Option ${optionsContainer.children.length + 1}`);
      optionsContainer.appendChild(newOption);
    }

    const deleteButton = createDeleteButton();

    div.appendChild(labelInput);
    div.appendChild(optionsContainer);
    div.appendChild(addOptionButton);
    div.appendChild(deleteButton);

    return div;
}



function createEditableRadioGroup(){}

function createEditableCheckboxGroup(){}

function createOption(defaultText){
    const optionDiv = createElement('div');
    optionDiv.classListadd('option-edit');

    const optionInput = document.createElement('input');
    optionInput.type = 'text';
    optionInput.value = defaultText;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Remove';
    deleteButton.type = 'button';
    deleteButton.classList.add('delete-button');
    deleteButton.onclick = function () {
        optionDiv.remove();
    }

    optionDiv.appendChild(optionInput);
    optionDiv.appendChild(deleteButton);

    return optionDiv;
}

function createDeleteButton(){
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.type = 'button';
    deleteButton.classList.add('delete-button');
    deleteButton.onclick = function () {
        this.parentElement.remove();
        toggleSubmitButton();
    }
    return deleteButton;
}

function toggleSubmitButton(){
    if (formBuilder.children.length > 0){
        if(!submitButton){
            submitButton = document.createElement('button');
            submitButton.textContent = 'Submit';
            submitButton.type = 'button';
            submitButton.classList.add('submit-button');
            submitButton.onclick = handleSubmit; 
        }

        formBuilder.appendChild(submitButton);
    }else{
        
        submitButton.remove();
        submitButton = null;
    }
}