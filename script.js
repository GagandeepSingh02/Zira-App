let modalExists = false;
let modal;
let transModal;
let selectedPriority;
let allFilters = $(".filter");
let info;

$(".help").mouseover(function(){
    info=$(`<div class="info">
    <h2><u>Features:</u></h2>
	<ul>
		<li><b>Add Tasks:</b> Click '+' Icon.</li>
		<br />
		<li><b>Delete Tasks:</b> Click '-' Icon.</li>
		<br />

		<li>
			<b>Delete All Tasks:</b> Click Button present in the top
			right corner.
		</li>
		<br />
		<li><b>View All Tasks:</b> Double click any color in the Toolbar.</li>
		<br />
		<li>
			<b>View Color specific Tasks:</b> Click that specific
			color in the Toolbar.
		</li>
		<br />		
		<li>
			<b>Setting Color of a Task:</b>
			After pressing '+' Icon, Enter your task description, then select the color for your task from the color palette.
		</li>
		<br />	
        <li><b>Each task has its unique id</b></li>
        <br />
		<p>
			<b><i>*Don't worry! Your data will be stored for the next time you visit us.</b>
		<i></i></p>
	</ul>
    </div>`)
     $(".ticket-container").append(info);
  
});

$(".help").mouseout(function(){
    info.remove();
});


function loadTickets(color) {
    let allTask = localStorage.getItem("allTask");
    if (allTask != null) {
        allTask = JSON.parse(allTask);
        if (color) {
            allTask = allTask.filter(function (data) {
                return data.priority == color;
            });
        }
        for (let i = 0; i < allTask.length; i++) {
            let ticket = $(`<div class="ticket">
                            <div class="priority-color priority-color-${allTask[i].priority}"></div>
                            <div class="ticket-id">#${allTask[i].ticketId}</div>
                            <div class="task-container">${allTask[i].task}</div>
                            </div>`);
            $(".ticket-container").append(ticket);
         
            ticket.click(function (e) {
                if ($(e.currentTarget).hasClass("active")) {
                    $(e.currentTarget).removeClass("active");
                } else {
                    $(e.currentTarget).addClass("active");
                    console.log(e.currentTarget);
                }
            });
        }
    }
}

    loadTickets();

    $(".add").click(showModal);
    $(".delete").click(removeTicket);

    $(allFilters).each(function(index,item){
        $(item).bind("click", filterHandler);
    });

    // for (let i = 0; i < allFilters.length; i++) {
    //     allFilters[i].click(filterHandler);
    // }
    
    function filterHandler(e) {
        //console.log(e.currentTarget);
        $(".ticket-container").html(""); 
        if ($(e.currentTarget).hasClass("active")) {
            $(e.currentTarget).removeClass("active");
            //console.log(e.currentTarget);
            loadTickets();
        } else {
            let activeFilter = $(".filter.active");
            if (activeFilter) {
                //console.log(activeFilter);
                activeFilter.removeClass("active");
            }

            $(e.currentTarget).addClass("active");
            //console.log(e);
            let ticketPriority = e.currentTarget.children[0].classList[0].split("-")[0];
            //console.log(ticketPriority);
            loadTickets(ticketPriority);
        }
    }

    function showModal(e) {
        if (!modalExists) {
            modal = $(`<div class="modal-parent">
            <div class="add-task">ADD TICKET</div>
            <div class="input-modal" contenteditable="true">
                <textarea class="textarea" datatyped="false" placeholder="Enter your task here"></textarea>
            </div>
            <div class="modal-confirmation">
                <div class="save-btn btn btn-grad ">Save</div>
                <div class="cancel-btn btn btn-grad ">Cancel</div>
            </div>
            <div class="priority-list">
                <div class="modal-pink-filter modal-filter active"></div>
                <div class="modal-blue-filter modal-filter"></div>
                <div class="modal-green-filter modal-filter"></div>
                <div class="modal-yellow-filter modal-filter"></div>
            </div>
        </div>`)
            transModal = $(`<div class="transparent-modal"></div>`);

            $(".ticket-container").append(modal);
            $(".ticket-container").append(transModal);

            selectedPriority = "pink";
            modal.animate({
                "width": "45vw"
            }, 700);

            setTimeout(() => {
                transModal.animate({
                    "width": "65vw"
                }, 300)
            }, 650)
            modalExists = true;

            let modalfilters = $(".modal-filter");
            $(modalfilters).each(function (index, item) {
                $(item).bind("click", selectPriority);
            });

            $(".cancel-btn").click(modalClose);

            $(".save-btn").click(addTicket);

        }


    }

    function selectPriority(e) {
        $(".modal-filter.active").removeClass("active");
        $(e.target).addClass("active");
        selectedPriority = e.target.classList[0].split("-")[1];

    }

    function addTicket(e) {
        let id = uid();
        let text = $(".textarea").val();
        if (text == "") {
            alert("Error! you have not type anything in task.")
         } 
         else {
            ticket = $(`<div class="ticket">
                    <div class="priority-color priority-color-${selectedPriority}"></div>
                    <div class="ticket-id">#${id}</div>
                    <div class="task-container">${text}</div>
                </div>`);
            $(".ticket-container").append(ticket);

        // ticket.click(function (e) {
        //     //console.log(e.currentTarget);
        //     if ($(e.currentTarget).hasClass("active")) {
        //         $(e.currentTarget).removeClass("active");
        //     } else {
        //         $(e.currentTarget).addClass("active");;
        //     }
        // });
        modalClose();

        let allTask = localStorage.getItem("allTask");
        if (allTask == null) {
            let data = [{ "ticketId": id, "task": text, "priority": selectedPriority }];
            localStorage.setItem("allTask", JSON.stringify(data));
        } else {
            let data = JSON.parse(allTask);
            data.push({ "ticketId": id, "task": text, "priority": selectedPriority });
            localStorage.setItem("allTask", JSON.stringify(data));
        }
        let activeFilter = $(".filter.active");
        //console.log(activeFilter[0]);
        $(".ticket-container").html("");
        if (activeFilter[0]) {
            let priority = selectedPriority;
            loadTickets(priority);
        } else {
            loadTickets();
        }
    }
    }


function modalClose(e) {
    transModal.animate({
        "width": "0vw"
    }, 300)
    setTimeout(() => {
        modal.animate({
            "width": "0vw"
        }, 600)
    }, 300)
    setTimeout(() => {
        modal.remove();
        transModal.remove();
    }, 800);

    modalExists = false;
}


function removeTicket(e) {
    let selectedTicket = $(".ticket.active");
    let allTask = JSON.parse(localStorage.getItem("allTask"));
    for (let i = 0; i < selectedTicket.length; i++) {
        selectedTicket[i].remove();
        console.log(selectedTicket);
        let ticketID = selectedTicket[i].querySelector(".ticket-id").innerText;
        allTask = allTask.filter(function (data) {
            return (("#" + data.ticketId) != ticketID);
        });
    }
    localStorage.setItem("allTask", JSON.stringify(allTask));
}

$(".delete-all").click(function(e){
    let ticketDelete = $(".ticket");
    for(let i = 0; i < ticketDelete.length; i++){
        $(ticketDelete[i]).addClass("active");
    }

    removeTicket();
})

