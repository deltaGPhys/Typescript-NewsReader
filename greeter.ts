class Article {
    // public vars in constructor don't need to be declared :)
    constructor(public title: string, public site: string, public description: string, public content: string, public imageUrl: string) {
    }
}

class ArticleSet {
    private static instance: ArticleSet;
    private articles: Article[];

    private constructor() {
    }

    public static getInstance(): ArticleSet {
        if (ArticleSet.instance == null) {
            ArticleSet.instance = new ArticleSet();
        }
        return ArticleSet.instance;
    }

    public setData(articles: Article[]) {
        this.articles = articles;
    }

    public getData() {
        return this.articles;
    }

}

interface Person {
    firstName: string;
    lastName: string;
}



function getTopNews() {
    var url = 'https://newsapi.org/v2/top-headlines?' +
            'country=us&' +
            'apiKey=d5a8f13f25e94786a1d4a394a097eed1';
    var req = new Request(url);
    fetch(req)
        .then(async (response) => {
            const data = await response.json();
            console.log(data.articles);
            let articles: Article[] = [];
            for (let i = 0; i < 3; i++) {
                let raw = data.articles[i];
                articles.push(new Article(
                    raw.title.split(" - ",1)[0],
                    raw.source.name,
                    raw.description,
                    raw.content,
                    raw.urlToImage
                ));
            }
            let articleSet: ArticleSet = ArticleSet.getInstance();
            articleSet.setData(articles);
            console.log(articles);
            console.log(articleSet.getData());
            populateTopNewsArticles();
        })
}

function populateTopNewsArticles() {
    const topStories = document.getElementById('topStories');
    let articleSet: ArticleSet = ArticleSet.getInstance();
    let articles: Article[] = articleSet.getData();
    for (let i = 0; i < 3; i++) {
        // console.log(topStories.children[i]);
        // console.log(topStories.children[i].children[0].getElementsByTagName('H3'));

        // let title: string = articles[i].title.split(" - ",1);
        // let site: string = articles[i].source.name;
        // let description: string = articles[i].description;
        // let content: string = articles[i].content;
        
        topStories.children[i].children[0].getElementsByTagName('H3')[0].textContent = articles[i].title;
        topStories.children[i].children[0].getElementsByTagName('H4')[0].textContent = articles[i].site;
        topStories.children[i].children[0].getElementsByTagName('P')[0].textContent = articles[i].description;
        topStories.children[i].children[0].getElementsByTagName('BUTTON')[0].value = i;
        
    }
}

function viewStory(objButton: Object) {
    let articleSet: ArticleSet = ArticleSet.getInstance();
    let articles: Article[] = articleSet.getData();
    let article = articles[objButton.value];
    
    const modal = document.getElementById('storyModal');
    const titleEl = modal.querySelector('.modal-title');
    titleEl.textContent = article.title;
    
    const bodyEl = modal.querySelector('.modal-body');
    bodyEl.textContent = article.content;


}

window.onload = function () {

    getTopNews();
}