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
        //case 'text':
        //    newElement = createEditableTextInput();
        case 'big-heading':
            newElement = createBigHeading();
            break;
        case 'small-heading':
            newElement = createSmallHeading();
            break;
        case 'paragraph':
            newElement = createParagraph();
            break;
        default:
            newElement = createBigHeading();
    }

    if (newElement){
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