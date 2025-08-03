const draggables = document.querySelectorAll('.draggable');
const formBuilder = document.getElementById('form-builder');
let submitButton = null;

draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', dragStart);
});

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
    const afterElement = getDragAfterElement(formBuilder, e.clientY);
    const draggable = document.querySelector('.dragging');

    if (afterElement == null) {
        formBuilder.appendChild(draggable);
    } else {
        formBuilder.insertBefore(draggable, afterElement);
    }
    toggleSubmitButton();
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.form-element:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return {
                offset: offset,
                element: child
            };
        } else {
            return closest;
        }
    }, {
        offset: Number.NEGATIVE_INFINITY
    }).element;
}

function drop(e) {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    let newElement;

    switch (type) {
        case 'big-heading':
            newElement = createTextElement('bigHead');
            break;
        case 'small-heading':
            newElement = createTextElement('smallHead');
            break;
        case 'paragraph':
            newElement = createTextElement('paragraph');
            break;
        case 'textinput':
            newElement = createInputElement('textInput');
            break;
        case 'textarea':
            newElement = createInputElement('textArea');
            break;
        case 'select':
            newElement = createMcqElement('select');
            break;
        case 'radio':
            newElement = createMcqElement('radio');
            break;
        case 'checkbox':
            newElement = createMcqElement('checkbox');
            break;
        default:
            newElement = document.createElement('div');
    }

    if (newElement) {
        formBuilder.appendChild(newElement);
        makeElementDraggable(newElement);
        toggleSubmitButton();
    }
}

function createTextElement(type) {
    const div = document.createElement('div');
    div.classList.add('form-element', `${type}Div`);
    div.setAttribute('draggable', 'true');

    const input = document.createElement('input');
    input.type = 'text';
    input.classList.add(`${type}Input`);

    if (type === 'bigHead') input.value = 'Big Heading';
    else if (type === 'smallHead') input.value = 'Small Heading';
    else if (type === 'paragraph') input.value = 'Paragraph text';

    div.appendChild(input);
    div.appendChild(createDeleteButton());
    return div;
}

function createInputElement(type) {
    const div = document.createElement('div');
    div.classList.add('form-element', `${type}Div`);
    div.setAttribute('draggable', 'true');

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.classList.add('label-edit');
    labelInput.value = `${type === 'textInput' ? 'Text Input Label' : 'Text Area Label'}`;

    const inputElement = type === 'textInput' ?
        document.createElement('input') :
        document.createElement('textarea');

    inputElement.type = 'text';
    inputElement.placeholder = type === 'textInput' ?
        'Enter text here...' :
        'Enter longer text here...';

    div.appendChild(labelInput);
    div.appendChild(inputElement);
    div.appendChild(createDeleteButton());
    return div;
}

function createMcqElement(type) {
    const div = document.createElement('div');
    div.classList.add('form-element', `${type === 'select' ? 'Select' : type === 'radio' ? 'Radio' : 'CheckBox'}Div`);
    div.setAttribute('draggable', 'true');

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.classList.add('label-edit');
    labelInput.value = `${type === 'select' ? 'Select Option' : type === 'radio' ? 'Radio Group' : 'Checkbox Group'}`;

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container');

    for (let i = 1; i <= 2; i++) {
        const option = document.createElement('div');
        option.classList.add('option-edit');

        const optionInput = document.createElement('input');
        optionInput.type = 'text';
        optionInput.value = `Option ${i}`;

        option.appendChild(optionInput);
        option.appendChild(createDeleteButton());
        optionsContainer.appendChild(option);
    }

    const addOptionButton = document.createElement('button');
    addOptionButton.textContent = 'Add Option';
    addOptionButton.onclick = () => {
        const newOption = document.createElement('div');
        newOption.classList.add('option-edit');

        const optionInput = document.createElement('input');
        optionInput.type = 'text';
        optionInput.value = `Option ${optionsContainer.children.length + 1}`;

        newOption.appendChild(optionInput);
        newOption.appendChild(createDeleteButton());
        optionsContainer.appendChild(newOption);
    };

    div.appendChild(labelInput);
    div.appendChild(optionsContainer);
    div.appendChild(addOptionButton);
    div.appendChild(createDeleteButton());
    return div;
}

function createDeleteButton() {
    const button = document.createElement('button');
    button.textContent = 'Delete';
    button.onclick = function () {
        this.parentElement.remove();
        toggleSubmitButton();
    };
    return button;
}

function makeElementDraggable(element) {
    element.addEventListener('dragstart', dragStart);
    element.addEventListener('dragend', dragEnd);
}

function toggleSubmitButton() {
    
    if (submitButton) {
        submitButton.remove();
        submitButton = null;
    }
    
    const hasElements = formBuilder.querySelectorAll('.form-element').length > 0;

    if (hasElements && !submitButton) {
        submitButton = document.createElement('button');
        submitButton.textContent = 'Submit Form';
        submitButton.classList.add('submit-button');
        submitButton.onclick = handleSubmit;
        formBuilder.appendChild(submitButton);
    } else if (!hasElements && submitButton) {
        submitButton.remove();
        submitButton = null;
    }
}

function handleSubmit() {
    const formData = [];
    const formElements = formBuilder.querySelectorAll('.form-element');

    formElements.forEach(element => {
        if (element.classList.contains('bigHeadDiv')) {
            formData.push({
                type: 'bigHead',
                value: element.querySelector('.bigHeadInput').value
            });
        } else if (element.classList.contains('smallHeadDiv')) {
            formData.push({
                type: 'smallHead',
                value: element.querySelector('.smallHeadInput').value
            });
        } else if (element.classList.contains('paragraphDiv')) {
            formData.push({
                type: 'paragraph',
                value: element.querySelector('.paragraphInput').value
            });
        } else if (element.classList.contains('textInputDiv') || element.classList.contains('textAreaDiv')) {
            formData.push({
                type: element.classList.contains('textInputDiv') ? 'textInput' : 'textArea',
                value: element.querySelector('.label-edit').value
            });
        } else if (element.classList.contains('SelectDiv') ||
            element.classList.contains('RadioDiv') ||
            element.classList.contains('CheckBoxDiv')) {

            const options = [];
            element.querySelectorAll('.option-edit input').forEach(option => {
                options.push(option.value);
            });

            formData.push({
                type: element.classList.contains('SelectDiv') ? 'select' : element.classList.contains('RadioDiv') ? 'radio' : 'checkbox',
                value: element.querySelector('.label-edit').value,
                options: options
            });
        }
    });

    localStorage.setItem('formData', JSON.stringify(formData));
    window.location.href = 'preview_form.html';
}