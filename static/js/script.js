$(document).ready( function () {

    drawTable();

    // add new event handler
    $(".add-new").click(function(){
        $(this).attr("disabled", "disabled");
        var row = `<tr>
                    <td><input type="text" class="form-control" name="first_name" id="first_name"></td>
                    <td><input type="text" class="form-control" name="last_name" id="last_name"></td>
                    <td><input type="date" class="form-control" name="dob" id="dob"></td>
                    <td><input type="text" class="form-control" name="email" id="email"></td>
                    <td><input type="text" class="form-control" name="class_no" id="class"></td>
                    <td><input type="text" class="form-control" name="parent_name" id="parent"></td>
                    <td><input type="number" class="form-control" name="phone_number" id="phone_number"></td>
                    <td><input type="number" class="form-control" name="year" id="yearpicker"></td>
                    <td></td><td></td>
                    <td><a class="add" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>
                    <a class="edit" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>
                    <a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>
                    <a class="cancel" title="Cancel" data-toggle="tooltip"><i class="material-icons">&#xe5c9;</i></a></td>
                 </tr>`;
        $("table tbody").prepend(row);
        $("table tbody tr").eq(0).find(".add, .edit, .cancel").toggle();
    });

    // edit event handler
    $(document).on("click", ".edit", function(){
        var i = 0;
        var name = '';
        $(this).parents("tr").find("td:not(.no-edit)").each(function(){
            name = getColumn(i++);
            if(name == 'dob'){
                $(this).html('<input type="date" name="' + name + '" class="form-control" value="' + $(this).text() + '">');
            }
            else if(name == 'year' || name == 'phone_number'){
                $(this).html('<input type="number" name="' + name + '" class="form-control" value="' + $(this).text() + '">');
            }
            else{
                $(this).html('<input type="text" name="' + name + '" class="form-control" value="' + $(this).text() + '">');
            }
		});
		$(this).parents("tr").find(".add, .edit, .cancel").toggle();

    })

    // cancel event handler
    $(document).on("click", ".cancel", function(){
        var pk = $(this).parents("tr").find("td:first").text();
        if(pk != ""){
            removeInputs($(this));
        }
        else{
            removeRow($(this));
            $('.add-new').attr("disabled", false);
        }

        $(this).parents("tr").find(".add, .edit, .cancel").toggle();
    })

    // add event handler
    $(document).on("click", ".add", function(){
        var pk = $(this).parents("tr").find("td:first").text();
        var action = (pk === "") ? 'add' : 'edit';
        if(confirm(`Do you want to ${action} the item?`)){
            var params = {};
            var add_btn = $(this);
            $(this).parents("tr").find("input").each(function(){
                params[$(this).attr('name')] = $(this).val();
            })


            params = JSON.stringify(params);

            var url = (pk === "") ? '/add/' : '/edit/' + pk;

            addOrEditItem(url, pk, params, add_btn);
        }
    })

    // delete event handler
    $(document).on('click', '.delete', function(){
        if(confirm('Do you want to delete this item?')){
            var delete_btn = $(this);
            var pk = $(this).parents("tr").find("td:first").text();
            $.ajax({
                url: '/delete/' + pk,
                type: 'POST',
                success: function(data) {
                    delete_btn.parents("tr").remove();
                },
                error: function(data){
                    alert("Error in deleting item!");
                }
            })
        }
    })
});

$(function() {
    $("table tr").hover(function() {
        $(this).addClass("active-row");
    }, function() {
        $(this).removeClass("active-row");
    });

    $('#studentTable tfoot th').each(function() {
        var title = $(this).text();
        if(title == 'Date of Birth' || title == 'Created' || title == 'Updated'){
            $(this).html('<input type="date" style="width: 100%; box-sizing: border-box;" placeholder="Search ' + title + '" />');
        }
        else if(title == 'Year Joined' || title == 'Phone Number'){
            $(this).html('<input type="number" style="width: 100%; box-sizing: border-box;" placeholder="Search ' + title + '" />');
        }
        else if(title == 'Actions'){
            $(this).html('<button type="button" class="btn btn-info clear-filter">Clear filters</button>');
        }
        else{
            $(this).html('<input type="text" style="width: 100%; box-sizing: border-box;" placeholder="Search ' + title + '" />');
        }
    });
});

function addOrEditItem(url, pk, params, add_btn){
    $.ajax({
      url: url,
      type: 'POST',
      data: {'params': params},
      success: function(data) {
        alert('Data saved successfully!');
        if(pk != ""){
            editSuccess(add_btn, data);
        }
        else{
            addSuccess(add_btn, data);
        }
        $(this).parents("tr").find(".add, .edit, .cancel").toggle();
        $('.add-new').attr("disabled", false);
      },
      error: function(data){
        alert(data.responseJSON.message);
      }
    });
}

function addSuccess(add_btn, data){
    var item = JSON.parse(data.message);
    var row = `<td class="no-edit id-column">${item['id']}</td>
               <td>${item['first_name']}</td>
               <td>${item['last_name']}</td>
               <td>${item['dob']}</td>
               <td>${item['email']}</td>
               <td>${item['class_no']}</td>
               <td>${item['parent_name']}</td>
               <td>${item['phone_number']}</td>
               <td>${item['year']}</td>
               <td class="no-edit">${item['created']}</td>
               <td class="no-edit">${item['updated']}</td>
               <td class="no-edit"><a class="add" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>
                   <a class="edit" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>
                   <a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>
                   <a class="cancel" title="Cancel" data-toggle="tooltip"><i class="material-icons">&#xe5c9;</i></a>
               </td>
    `;
    add_btn.parents("tr").html(row);
}

function editSuccess(add_btn, data){
    removeInputs(add_btn);
    add_btn.parents("tr").find('td:nth-last-child(2)').text(JSON.parse(data.message)['updated'])
}


function removeInputs(el){
    el.parents("tr").find("td:not(.no-edit)").each(function(){
        $(this).text($(this).find('input').val())
        $(this).find('input').remove();
    })
}

function removeRow(el){
    el.parents("tr").remove();
}

function getColumn(index){
    return {
        0: 'first_name',
        1: 'last_name',
        2: 'dob',
        3: 'email',
        4: 'class_no',
        5: 'parent_name',
        6: 'phone_number',
        7: 'year'
    }[index];
}

