var matcher = function (strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;
    matches = [];
    substrRegex = new RegExp(q, 'i');

    $.each(strs, function (i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });

    cb(matches);
  };
};

var bloodMatcher = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.whitespace,
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  // url points to a json file that contains an array of country names, see
  // https://github.com/twitter/typeahead.js/blob/gh-pages/data/countries.json
  prefetch: '../classes.json'
});

var classes = ["Study Hall", "PERSONAL FINANCE","AP ENGLISH LANGUAGE","SPANISH 3","AP CALCULUS AB","AP CHEMISTRY","PHYSICS 1","AP US HISTORY","ART 1","HEALTH 9TH","DRAWING AND PAINTING","ART 2","ART 3","PHYSICAL EDUCATION 1","ARTS & CRAFTS","COMMERCIAL ART","PHYSICAL EDUCATION 2A","HISTORY OF WESTERN ART","PHYSICAL EDUCATION 2B","DIGITAL IMAGING","WEIGHTLIFTING","JROTC 1","Student Instruct. Leadership","JROTC 2","JROTC 3","INTRODUCTION TO ENGINEERING","PRINCIPLES OF ENGINEERING","DIGITAL ELECTRONICS","CIVIL ENG. AND ARCHITECTURE","COMPUTER ESSENTIALS","ACCOUNTING 1","ACCOUNTING 2","WEB DESIGN I","WEB DESIGN II","BUSINESS FOUNDATIONS","BUSINESS & PERSONAL LAW","MICROSOFT OFFICE","SUPPLY CHAIN MANAGEMENT","ECONOMICS","ENGLISH 11 CP","PUBLIC SPEAKING","MYTHOLOGY","YEARBOOK","YEARBOOK 2","INTRO TO FILM THEORY/CRITICISM","FRENCH 1","FRENCH 2","FRENCH 3","FRENCH 4","FRENCH 5 AP","SPANISH 1","SPANISH 2","SPANISH 4","CHINESE 1 DE","CHINESE 2 DE","CHILD DEVELOPMENT/PARENTING","GLOBAL FOODS","FOOD SCIENCE","CULINARY FUNDAMENTALS","NUTRITIONAL WELLNESS","PERSONAL WELLNESS","INTERIOR DESIGN, FURN. AND MAN","SPORTS NUTRITION","ALGEBRA 2 CP","ESSENTIALS OF ALGEBRA 2","APPLIED ALGEBRA 2","PRE-CALCULUS CP","SCHOLARSHIP PRECALCULUS","CALCULUS CP","AP STATISTICS","INTRO TO COMPUTER SCIENCE PRIN","INTRO TO JAVA PROGRAMMING","AP COMPUTER SCIENCE A","AP COMPUTER SCIENCE PRINCIPLES","PRACTICAL PROGRAMMING","AP CALCULUS BC","STATISTICS","PROBLEM SOLVING SKILLS","TRANSITIONAL MATH","ENGINEERING 1010","SYMPHONY BAND","WIND ENSEMBLE","PERCUSSION ORCHESTRA","CONCERT CHOIR 1","CONCERT CHOIR 2","MUSIC APPRECIATION","AP MUSIC THEORY","BIOLOGY 1","AP BIOLOGY","CHEMISTRY 1","AP PHYSICS","EARTH AND THE ENVIRONMENT","AP ENVIRONMENTAL SCIENCE","PRIN. OF BIOMEDICAL SCI","HUMAN BODY SYSTEMS","MEDICAL INTERVENTIONS","AMERICAN & GLOBAL ISSUES","PSYCHOLOGY","SOCIOLOGY", "AP Government", "Engineering (Other)", "Math (Other)", "Social Studies (Other)", "Science (Other)", "College English", "English 9 CP", "English 10 CP", "English 12 CP", "English 9 Honors", "English 10 Honors", "AP English Literature", "NOT LISTED"];
var teachers = ["Ames","Barnes","Basinger","Baudendistel","Bertke","Bills-Tenney","Breese","Brown, C.","Brown, G.","Caldwell","Carreira","Chen","Chitwood","Christofano","Combs","Craig","Crute","Dyer","Eggleton","Enderson","Erwin","Fogarty","Foster","Franz","Fromm","Giles","Gogol","Gray","Guerrero","Hasler","Heller","Hensley","Hunt","Jergens","Jettinghoff","Lambright","Longo","Mann","Marsh","Missler","Moore","Nitsch","Parks","Pederson","Potter","Ralston","Reed","Reinhart","Rivero","Rommel","Rose","Ruble","Sampson","Schultz P","Schultz R","St. Pierre","Sumner","Will","Williamson","Yahle","Yaufman", "NOT LISTED"];
$( function() {
  console.log("it works");
  $(".class-field").typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  }, {
    name: "classes",
    source: bloodMatcher
  });

  $(".teacher-field").typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  }, {
    name: "teachers",
    source: matcher(teachers)
  });
});
