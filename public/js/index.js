$(document).ready( () => {
    // holds our scraped headlines
    const articleContainer = $(".article-container");

    //click event listener that saves headlines
    $(document).on("click", ".btn-save", handleArticleSave);
    //click event listener to scrape new articles
    $(document).on("click", ".btn-scrape", handleArticleScrape);
    $(document).on("click", ".scrape-new", handleArticleScrape);

    // layout
    initPage();

    function initPage() {
        // empty article container/run AJAX request for unsaved headlines
        articleContainer.empty();
        $.get("/api/headlines?saved=false").then(date => {
            //if there are articles, render them to DOM
            console.log(data);

            if (data && data.length) {
                renderArticles(data);
            } else {
                //render message "no articles"
                renderEmpty();
            }
        });
    };

    function renderArticles(articles) {
        // passed argument is array of JSON containing all available articles in db
        const articlePanels = [];
        // pass each JSON object to function createPanel
        for (let i = 0; i < articles.length; i++) {
            articlesPanels.push(createPanel(articles[i]));
        }

        //createPanel stored in HTML in array of articlePanels
        //appends each to main 
        articleContainer.append(articlePanels);
    }

    function createPanel(article) {
        //takes single JSON object to create a jQuery element composed of formatted HTML
        let panel = $(
            `<div id="${article._id}" class="panel panel-default panel-margin">
            <div id="headline-panel" class="panel-heading clearfix">
              <p class="panel-title align-middle"><a href="${article.url}" target="_blank">${article.title}</a></p>
              <button type="button" class="btn btn-success pull-right btn-save">Save Article</button>
  
            </div>
            <div class="panel-body">
              <div class="col-lg-2 col-md-2 col-sm-2 news-thumb" >
              <a href="${article.url}" target="_blank"><img width="200px" class="img-responsive img-thumbnail news-thumb" src="${article.imgUrl}" alt="${article.title}" /></a>
              </div> 
              <div class="col-lg-10 col-md-10 col-sm-10 summary-text" >
              <p>${article.summary}</p>
              </div> 
            </div>
        </div>`
        );
        //attaches article ID to determine article that will be saved
        panel.data("_id", article._id);
        // return constructed panel
        return panel;
    }

    function renderEmpty() {
        //no new articles
        const emptyAlert = $(
            `<div class="alert alert-info text-center">
                <h4>Hmm... looks like there aren't any new articles</h4>
            </div>
            <div class = "panel panel-default">
                <div class = "panel-heading text-center">
                    <h3>What would you like to do?</h3>
                </div>
            
                <div class = "panel-body text-center">
                    <h4><a class='scrape-new'>Try to scrape a new article</a></h4>
                    <h4><a href="/saved">Go to saved articles</a></h4>
                </div>
            </div>`
        );
        //append alert data to main container
        articleContainer.append(emptyAlert);
    }

    function handleArticleSave() {
        // when a user saves an article
        let articleToSave = $(this)
        .parents(".panel")
        .data();
        articleToSave.saved = true;

        // PUT request to update exisitng db and reload page
        $.ajax({
            method: "PUT",
            url: `api/headlines/${articleToSave._id}`,
            data: articleToSave
        }).then(data => {
            if(data.saved) {
                initPage();
            }
        });
    }

    function handleArticleScrape() {
        //scrape Vulture.com, compare with existing articles in db
        //re-render DOM
        $.get("/api/fetch").then(data => {
            initPage();
            bootbox.alert(`<h3 class= "text-center m-top-08">${data.message}</h3>`)
        });
    }

});