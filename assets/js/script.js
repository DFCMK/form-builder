const draggables = document.querySelectorAll('.draggable');
const formBuilder = document.getElementById('form-builder');

draggables.forEach(draggable => {
  draggable.addEventListener('dragstart', dragStart);
  draggable.addEventListener('dragend', dragEnd);
});

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
  e.dataTransfer.setData('type', e.target.getAttribute('data-type'));
  e.target.classList.add('dragging');
}

function dragEnd(e) {
  e.target.classList.remove('dragging');
}

function dragOver(e) {
  e.preventDefault();
  formBuilder.classList.add('drag-active');
}

function drop(e){
    e.preventDefault();
    const type = e.dataTransfer.getData('type');

    let newElement;
    switch(type){
        case 'big-heading':
            newElement = createBigHeading();
            break;
        case 'small-heading':
            newElement = createSmallHeading();
            break;
        case 'paragraph':
            newElement = createParagraph();
            break;
        case 'text':
            newElement = createEditableTextInput();
        case 'textarea':
            newElement = createEditableTextArea();
        case 'select':
            newElement = createEditableMCQ('select');
        case 'radio':
            newElement = createEditableMCQ('radio');
        case 'checkbox':
            newElement = createEditableMCQ('checkboxt');
        default:
            newElement = createBigHeading();
    }

    if (newElement){a
        formBuilder.appendChild(newElement);
        makeElementDraggable(newElement);
        toggleSubmitButton();
    }
}

function createBigHeading(){
    const div = document.createElement('div');
    div.setAttribute('draggable', true);
    div.classList.add('bigHeadDiv');

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.classList.add('bigHeadInput');
    labelInput.value = '--change this Big Heading-';

    div.appendChild(labelInput);

    const deleteButton = createDeleteButton();
    div.appendChild(deleteButton);

    return div;
}

function createSmallHeading(){
    const div = document.createElement('div');
    div.setAttribute('draggable', true);
    div.classList.add('smallHeadDiv');

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.classList.add('smallHeadInput');
    labelInput.value = '--change this Small Heading-';

    div.appendChild(labelInput);

    const deleteButton = createDeleteButton();
    div.appendChild(deleteButton);

    return div;
}

function createParagraph(){
    const div = document.createElement('div');
    div.setAttribute('draggable', true);
    div.classList.add('ParagraphDiv');

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.classList.add('smallHeadInput');
    labelInput.value = '--change this paragraph-';

    div.appendChild(labelInput);

    const deleteButton = createDeleteButton();
    div.appendChild(deleteButton);

    return div;
}

function createEditableTextInput(){
    const div = document.createElement('div');
    div.setAttribute('draggable', true);
    div.classList.add('form-element', 'textInputDiv');

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.classList.add('label-edit');
    labelInput.value = 'Text Input Label';

    const inputElement = document.createElement('input');
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

function toggleSubmitButton(){}