//= lib/jquery

//= lib/handlebars

gifs = [];
interactives = [];
popupData = {};

window.onload = onPageLoad;

$("body,html").addClass("unscrollable");

function onPageLoad() {
  console.log("Loading page...");
  requestGifs();
}

function requestGifs() {
  console.log("Requesting gifs...");
  $.getJSON("json/gif-data.json", null, function(data, textStatus) {
    gifs = data;
    console.log("Gifs loading success");
    requestInteractives();
  });
}

function requestInteractives() {
  console.log("Requesting interactives...");
  $.getJSON("json/interactive-data.json", null, function(data, textStatus) {
    interactives = data["interactives"];
    popupData = data["pop-up-data"];
    console.log("Interactives loading success");
    init();
  });
}

function init() {
  placeGifs();
  placeInteractiveElements();
  scrollToBottom();
  addListeners();
  setTimeout(closePreloader, 4500);
  console.log("Loading complete");
  $("#about").hide();
}

function addListeners() {
  $(".interactive").click(onInteractiveClick);
  $("#home-button").click(function() {
    $("#about").fadeOut();
    $("body,html").removeClass("unscrollable");
    scrollToBottom();
  });
  $(document).scroll(onPageScroll);
}


function placeGifs() {
  for (var a = 0; a < gifs.length; a++)
  {
    var source = $("#gif-template").html();
    var template = Handlebars.compile(source);
    $(".gifs-container").append(template(gifs[a]));
  }
}

function placeInteractiveElements() {
  for (var a = 0; a < interactives.length; a++)
  {
    var source = $("#interactive-template").html();
    var template = Handlebars.compile(source);
    $(".interactives-container").append(template(interactives[a]));
  }
}


function closePreloader() {
  $("#preloader").fadeOut(500);
  $("body,html").removeClass("unscrollable");
  $(".arrow.up").addClass("invisible");
  setTimeout(appearUpArrow, 1000);
}

function scrollToBottom() {
  setTimeout(function() {
    window.scrollTo(0, $(document).height());
  });
}

function onInteractiveClick(event) {
  createInteractiveWindow($(event.target).attr("dataID"));
}

function createInteractiveWindow(dataID) {
  if (popupData[dataID].type=="video")
    var source = $("#video-template").html();
  else
    var source = $("#window-template").html();
  var template = Handlebars.compile(source);

  $("body").append(template(popupData[dataID]));
  $("body,html").addClass("unscrollable");
  $(".interactive-window-bg,.close-button").click(closeInteractiveWindow);
}

function closeInteractiveWindow() {
  if ($(".interactive-window-container").length > 0)
  {
    $(".interactive-window-bg,.close-button").off("click");
    $(".interactive-window-container").fadeOut(200, function() {
      $(".interactive-window-container").remove();
      $("body,html").removeClass("unscrollable");
    });
  }
}

function appearUpArrow() {
  if ($(".arrow.up").hasClass("invisible") && window.innerHeight+window.scrollY >= $("body").offset().top+$("body").height())
    $(".arrow.up").removeClass("invisible");
}

function onPageScroll(event) {
  var contentBegin = $("#main-content").offset().top;
  var position = window.scrollY;
  var translate = position/contentBegin*60;
  $("#diamond").css("transform", "translateY(-" + translate + "vh)");

  if (Math.round(translate) == 0)
    enableDiamond();
  else if (Math.round(translate) != 0)
    disableDiamond();

  // if ($(".arrow.up").hasClass("invisible") && window.innerHeight+window.scrollY+($("body").offset().top+$("body").height())/10 >= $("body").offset().top+$("body").height())
  //   $(".arrow.up").removeClass("invisible");
  if (!$(".arrow.up").hasClass("invisible") && window.innerHeight+window.scrollY+($("body").offset().top+$("body").height())/10 < $("body").offset().top+$("body").height())
    $(".arrow.up").addClass("invisible");
}

function initManifesto() {
  var scrollAvailable = $(".manifesto .wrapper .content")[0].scrollHeight > $(".manifesto .wrapper .content").height();
  if (!scrollAvailable)
    $(".manifesto .arrow.down").addClass("invisible");
  else {
    $(".manifesto .wrapper .content").scroll(function() {
      if (!$(".manifesto .arrow.down").hasClass("invisible") && $(".manifesto .wrapper .content").scrollTop() != 0)
        $(".manifesto .arrow.down").addClass("invisible");
    }); 
  }
  $(".manifesto .close-background").click(closeInteractiveWindow);
}

function enableDiamond() {
  if (!$("#diamond").hasClass("enabled"))
  {
    $("#diamond").addClass("enabled");
    $("#diamond").click(function() {
      $("body,html").addClass("unscrollable");
      $("#about").fadeIn();
    });
  }
}

function disableDiamond() {
  if ($("#diamond").hasClass("enabled")) {
    $("#diamond").removeClass("enabled");
    $("#diamond").off("clicK");
  }
}