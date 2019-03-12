$(document).ready(() => {
    var articleContainer = $(".article-container");
    // add event listeners for clicks
    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);

    // load saved articles
    initPage();

    function initPage() {
        // empty container, runs AJAX request for saved headlines
        articleContainer.empty();
        $.get("/api/headlines?saved=true").then(data => {
            // if we have articles saved, render to DOM
            if (data && data.length) {
                renderArticles(data);
            } else {
                //render message for no saved articles
                renderEmpty();
            }
        });
    }

    function renderArticles(articles) {
        // passes array of JSON containing all available articles in db
        const articlePanels = [];
        // passes each JSON object to function createPanel
        for (var i = 0; i < articles.lenght; i++) {
            articlePanels.push(createPanel(articles[i]));
        }

        // createPanel is now stored in HTML in array articlePanels
        // append each to container
        articleContainer.append(articlePanels);
    }

    function createPanel(article){
        //this function takes a single JSON object and creates a jQuery element composed of HTML
        let panel = $(
            `<div class="panel panel-default panel-margin">
                <div id="headline-panel" class="panel-heading clearfix">
                    <p class="panel-title align-middle"><a href="{article.url}" target="_blank">${article.title}</a></p>
                    <button type="button" class="btn btn-danger pull-right delete">Delete from saved</button>
                    <button type="button" class="btn btn-info pull-right notes">Article Notes</button>
                </div>

                <div class="panel-body">
                    <div class="col-lg-2 col-md-2 col-sm-2 news-thumb">
                        <a href="${article.url}" target="_blank"></a>
                    </div> 
                    <div class="col-lg-10 col-md-10 col-sm-10 summary-text">
                        <p>${article.summary}</p>
                    </div>
                </div>
            </div>`
        );

        panel.data("_id", article._id);
        //return constructed jQuery panel
        return panel;
    }

    function renderEmpty() {
        //no saved articles
        const emptyAlert = $(
           ` <div class="alert alert-info text-center">
                <h4>Hmm, looks like we don't have any saved articles.</h4>
            </div>
            <div class="panel panel-default">
            <div class="panel-heading text-center">
                <h3>Would you like to browse available articles?</h3>
            </div>
            <div class="panel-body text-center">
                <h3><a href='/'>Browse Articles</a></h3>
            </div>
            </div>`
        );
        //append alert data to main container
        articleContainer.append(emptyAlert);
    }

    function renderNotesList(data) {
        // handles rendering note list to notes modal
        // array of notes rendered once finished
        // currentNote will temp. store each note
        let notesToRender = [];
        let currentNote;
        if(!data.notes.length){
            currentNote = `<li class="list-group-item">No notes for this article yet.</li>`;
            notesToRender.push(currentNote);
        } else {
            for (let i = 0; i < data.notes.length; i++) {
                //construct <li> element to contain noteText & delete btn
                currentNote = $(
                    `<li class="list-group-item note">${data.notes[i].noteText}
                    <button class="btn btn-danger pull-right note-delete">x</button></li>`
                );
                //stores note ID on delete 
                currentNote.children("button").data("_id", data.notes[i]._id);
                // adds currentNote to noteToRender array
                notesToRender.push(currentNote);
                
            }
        }
        // appends notesToRender to note-container in note modal
        $(".note-container").append(notesToRender);
    }

    function handleArticleDelete() {
        // deletes panel the delete buttons sit inside 
        let articleToDelete = $(this).parents(".panel").data();
        $.ajax({
            method: "DELETE",
            url: `/api/headlines/${articleToDelete._id}`
        }).then(data => {
            //re-render list
            if(data.ok) {
                initPage();
            }
        });
    }

    function handleArticleNotes() {
        //opens notes modal
        //gets article id from panel element
        let currentArticle = $(this).parents(".panel").data();

        // gets associated notes
        $.get(`/api/notes/${currentArticle._id}`).then(data => {
            //construct notes HTML
            let modalText = 
            `<div class="container-fluid text-center">
            <h4>Notes For Article: ${currentArticle._id}</h4>
            <hr />
            <ul class="list-group note-container"></ul>
            <textarea class="note-textarea" placeholder="New Note" rows="4" cols="70"></textarea>
            <button class="btn btn-success save">Save Note</button>
            </div>`;
            //add HTML to note modal
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            let noteData = {
                _id: currentArticle._id,
                notes: data || []
            };
            // put ID on save btn for easy access
            $(".btn.save").data("article", noteData);
            //populate noteHTML inside opened modal
            renderNotesList(noteData);
        });

    }

        function handleNoteSave() {
            // saves new note - variable holds note from input
            let noteData;
            let newNote = $(".bootbox-body textarea").val().trim();
            // if we have a new note, post to DB and close
            if(!newNote) {
                alert ("Please add a note");
            } else {
                noteData = {
                    article: $(this).data("article")._id,
                    noteText: newNote
                };
                $.post("/api/headlines/" + noteData.article, noteData).then ( () => {
                    bootbox.hideAll();
                });

            }
        }

        function handleNoteDelete() {
            // grab ID stored on delete btn and delete note
            let noteToDelete = $(this).data("_id");
            // deletes note and closes modal
            $.ajax({
                url: `/api/notes/${noteToDelete}`,
                method: "DELETE"
            }).then ( () => {
                bootbox.hideAll();
            });
        }
});