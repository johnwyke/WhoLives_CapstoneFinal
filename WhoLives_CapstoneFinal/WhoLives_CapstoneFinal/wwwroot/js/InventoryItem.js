﻿
var dataTable;
var Qty_ID = {};
var name = document.createElement("input");
$(document).ready(function () {    
    loadInventoryList();
    loadOrderList();
    loadAssemblyList();
});

function loadInventoryList() {
    dataTable = $('#AllItem').dataTable({
        "ajax": {
            "url": "/api/inventoryItem/",
            "data": { input:"ALL"},
            "type": "GET",
            "datatype": "json"

        },
        "columns": [
            {
                "data": { ItemId: "inventoryItemID", name: "name" },
                "render": function (data) {
                    return `<a href=/Inventory/Upsert?id=${data.inventoryItemID} style = "cursor:pointer"> 
                            ${data.name}
                    </a> `
                }, "width": "50%" 
            },
            { "data": "totalLooseQty", "width": "25%" },
            {"data":"reorderQty","width":"25%"}

        ], "language": {
            "emptyTable": "no data found."
        },
        "width": "100%"
        
    });
}
function loadOrderList() {
    dataTable = $('#ReOrderTable').DataTable({
        "ajax": {
            "url": "/api/inventoryItem/",
            "data": { input: "ORDER" },
            "type": "GET",
            "datatype": "json"
        },
        select: {
            style: "multi",
            items:"row"
        },
        "columns": [
            {
                "data": "inventoryItemID",
                //"render": function (data) {
                //    return ` <div class="text-center">
                //               <input type="checkbox" />
                //             </div>`
                //},
                "visible":false,
                "width": "5%"
            },
            { "data": "name", "width": "50%" },
            { "data": "totalLooseQty", "width": "10%" },
            { "data": "reorderQty", "width": "10%" },
            { "data": "vendorItems", "width": "25%" }

        ], "language": {
            "emptyTable": "no data found."
        },
        "width": "100%"

    }).on('click', 'tbody tr', function () {
        // Need to check if Vendor has been selected  belfore Selection is allowed 
        if ($('#ReOrderTable').DataTable().row(this, { selected: true }).any()) {
            //$('#ReOrderTable').DataTable().row(this).deselect();
            $('#ReOrderTable').DataTable().row(this, { selected: false });
        }
        else {
            $('#ReOrderTable').DataTable().row(this, { selected: true });
        }
    });

}
function loadAssemblyList() {
    dataTable = $('#AssembleDisassemble').dataTable({
        "ajax": {
            "url": "/api/inventoryItem/",
            "data": { input: "Assemble" },
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            {
                "data": { ItemId: "inventoryItemID", name: "name" },
                "render": function (data) {
                    return `<a href=/Inventory/Upsert?id=${data.inventoryItemID} style = "cursor:pointer"> 
                            ${data.name}
                    </a> `
                }, "width": "50%" },
            { "data": "totalLooseQty", "width": "20%" },
            { "data": "reorderQty", "width": "20%" },
            {
                "data": "inventoryItemID",
          
                "render": function (data) {
                    return ` <div class="text-center">
                               <input type="number" style="width:15%;" id ="asse${data}"/> <a class="btn btn-primary text-white" style="cursor:pointer; width:50%;" onClick="assemble(${data})">
                                    <i class="far fa-edit">Assemble</i>
                                </a>
                            </div>
                            <div class="text-center">
                               <input type="number" style="width:15%;" id ="asse${data}"/> <a class="btn btn-danger text-white" style="cursor:pointer; width:50%;" onClick="disassemble(${data})">
                                    <i class="far fa-trash-alt">Disassemble</i>
                                </a>
                             </div>`
                },
                "width": "10%"
            }

        ], "language": {
            "emptyTable": "no data found."
        },
        "width": "100%"

    });
}

function assemble(id) {
    //console.log('asse' + id);
    var qty = document.getElementById('asse' + id).value;
   // console.log("my Id is" + id + 'and I made ' + qty);
    Qty_ID = { QTY: qty, ITEMID: id };
    $.ajax({
        url: '/api/inventoryItem/assemble'+'?QTY='+qty+'&ITEMID='+id,
        type: 'POST',       
        data: Qty_ID, //JSON.stringify(Qty_ID),
       // contentType: 'application/json; charset=utf-16',
        dataType:'json',
        success: function (data) {
            if (data.success) {
                swal(data.message, {
                    icon: "success"
                });
                //dataTable.ajax.reload();
            } else if (data.error) {
                swal(data.message,{
                    icon: "error"
                });
            }
            else {
                swal(data.message, {
                    icon: "warning"
                });
                
            }
        }
    });
}
function disassemble(id) {
    //console.log('asse' + id);
    var qty = document.getElementById('asse' + id).value;
    // console.log("my Id is" + id + 'and I made ' + qty);
    Qty_ID = { ITEMID: id, QTY: qty };
    $.ajax({
        url: '/api/inventoryItem/disassemble' + '?QTY=' + qty + '&ITEMID=' + id,
        type: 'POST',
        data: Qty_ID, //JSON.stringify(Qty_ID),
        // contentType: 'application/json; charset=utf-16',
        dataType: 'json',
        success: function (data) {
            if (data.success) {
                swal(data.message, {
                    icon: "success"
                });
                //dataTable.ajax.reload();
            } else if (data.error) {
                swal(data.message, {
                    icon: "error"
                });
            }
            else {
                swal(data.message, {
                    icon: "warning"
                });

            }
        }
    });
}
function PassSelection() {
    var SelectedRows = $('#ReOrderTable').DataTable().rows({ selected: true }).data();

    

}