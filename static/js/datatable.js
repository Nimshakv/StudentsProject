function drawTable(){

    $('#studentTable').DataTable({
        processing: true,
        serverSide: true,
        bSort: false,
        ajax: "/load",
        paging: true,
        pageLength: 25,
        sPagingType: 'simple',
        columns: [
            {data: 'id'},
            { data: "first_name" },
            { data: "last_name" },
            { data: "dob" },
            { data: "email" },
            { data: "class_no" },
            { data: "parent_name" },
            { data: "phone_number" },
            { data: "year" },
            { data: "created",
              class: "no-edit"
            },
            { data: "updated",
              class: "no-edit"
            }
        ],
        columnDefs: [{"render": createActionBtns, "data": null, "className": 'no-edit', "targets": [11]},
                       {"className": 'no-edit id-column', "targets": [0]},
                       {"render": convertToLocal, "targets": [9] },
                       {"render": convertToLocal, "targets": [10] }
                       ],
        colReorder: true,
        initComplete: function(){

          var api = this.api();
          api.columns().every(function() {
            var table = this;
            $('input', this.footer()).on('keyup change', function() {
              if (table.search() !== this.value) {
                table
                  .search(this.value)
                  .draw();
              }
            });

            $('.clear-filter').on('click', function(){
                $(this).parents('tr').find('input').each(function(){
                    $(this).val('');
                });
                table.search('').draw();
            })
          });
        }
    })

    function createActionBtns() {
        return `<a class="add" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>
               <a class="edit" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>
               <a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>
               <a class="cancel" title="Cancel" data-toggle="tooltip"><i class="material-icons">&#xe5c9;</i></a>`;
    }

    function convertToLocal(data, type, row, meta){
        var localtime = new Date(data);
        var month = localtime.getMonth()+1;
        return localtime.getFullYear()+'/'+ month +'/'+localtime.getDate()+
               ' '+localtime.getHours()+':'+localtime.getMinutes()+':'+localtime.getSeconds();
    }
}