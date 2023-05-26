const tbodyElm = $("#tbl-customers tbody");
const modalElm = $("#new-customer-modal");
const txtId = $("#txt-id");
const txtDescription = $("#txt-description");
const txtPrice = $("#txt-price");
const txtStock = $("#txt-quantity");
const btnSave = $("#btn-save");

tbodyElm.empty();

function formatItemId(id) {
    return `C${id.toString().padStart(3, '0')}`;
}

[txtDescription, txtPrice, txtStock].forEach(txtElm =>
    $(txtElm).addClass('animate__animated'));

btnSave.on('click', () => {
    if (!validateData()) {
        return false;
    }

    const id = txtId.val().trim();
    const description = txtDescription.val().trim();
    const price = +txtPrice.val();
    const stock = +txtStock.val();

    console.log(description,price,stock);

    let item = {
        description, price, stock
    };

    /* Todo: Send a request to the server to save the customer */

    /* 1. Create xhr object */
    const xhr = new XMLHttpRequest();

    /* 2. Set an event listener to listen readystatechange */
    xhr.addEventListener('readystatechange', ()=> {
        if (xhr.readyState === 4){
            [txtDescription, txtPrice, txtStock, btnSave].forEach(elm => elm.removeAttr('disabled'));
            $("#loader").css('visibility', 'hidden');
            if (xhr.status === 201){
                item = JSON.parse(xhr.responseText);
                tbodyElm.append(`
                    <tr>
                        <td class="text-center">${formatCustomerId(item.id)}</td>
                        <td>${item.description}</td>
                        <td class="d-none d-xl-table-cell">${item.price}</td>
                        <td class="contact text-center">${item.stock}</td>
                        <td>
                            <div class="actions d-flex gap-3 justify-content-center">
                                <svg data-bs-toggle="tooltip" data-bs-title="Edit Customer" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                    class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path
                                        d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path fill-rule="evenodd"
                                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                </svg>
                                <svg data-bs-toggle="tooltip" data-bs-title="Delete Customer" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                    class="bi bi-trash" viewBox="0 0 16 16">
                                    <path
                                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                    <path
                                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                                </svg>
                            </div>
                        </td>
                    </tr>
                `);

                resetForm(true);
                txtDescription.trigger('focus');
                showToast('success', 'Saved', 'Item has been saved successfully');
            }else{
                const errorObj = JSON.parse(xhr.responseText);
                showToast('error', 'Failed to save', errorObj.message);
            }
        }
    });

    /* 3. Let's open the request */
    xhr.open('POST', 'http://localhost:8080/pos/items', true);

    /* 4. Let's set some request headers */
    xhr.setRequestHeader('Content-Type', 'application/json');

    /* 5. Okay, time to send the request */
    xhr.send(JSON.stringify(item));

    [txtDescription, txtPrice, txtStock, btnSave].forEach(elm => elm.attr('disabled', 'true'));
    $("#loader").css('visibility', 'visible');

});
    function validateData() {
        const description = txtDescription.val().trim();
        const price = txtPrice.val();
        const stock = txtStock.val();
        let valid = true;
         // resetForm();

        if (!description) {
            valid = invalidate(txtDescription, "Description can't be empty");
        } else if (!/^.{3,}$/.test(txtDescription)) {
            valid = invalidate(txtDescription, 'Invalid description');
        }

        if (!price) {
            valid = invalidate(txtPrice, "price can't be empty");
        } else if (!/^.+$/.test(txtPrice)) {
            valid = invalidate(txtPrice, 'Invalid price');
        }

        if (!stock) {
            valid = invalidate(txtStock, "stock can't be empty");
        } else if (!/.+$/.test(txtStock)) {
            valid = invalidate(txtStock, "Invalid stock");
        }

        return valid;
    }


    function invalidate(txt, msg) {
        setTimeout(() => txt.addClass('is-invalid animate__shakeX'), 0);
        txt.trigger('select');
        txt.next().text(msg);
        return false;
    }

