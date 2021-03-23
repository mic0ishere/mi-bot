$(".categories li").on("click", setCategory);

const acc = document.getElementsByClassName("accordionButton");
for (let i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    this.classList.toggle("activeAccordion");
    var panel = this.children[0];
    if (panel.style.maxHeight) {
      this.style.fontSize = "100%";
      panel.style.maxHeight = null;
      panel.style.fontSize = "100%";
    } else {
      this.style.fontSize = "200%";
      panel.style.maxHeight = panel.scrollHeight + "px";
      panel.style.fontSize = "50%";
    }
  });
}

function setCategory() {
  blank();

  const selected = $(this);
  selected.addClass("active");

  const categoryCommands = $(`.commands .${selected[0].id}`);
  categoryCommands.show();

  updateResultsText(categoryCommands);
}
function blank() {
  $(".categories li").removeClass("active");
  $(".commands li").hide();
}

$("#search + button").on("click", () => {
  const query = $("#search input").val();
  if (!query.trim()) {
    updateResultsText(commands);
    return $(".commands li").show();
  }

  const results = new Fuse(commands, {
    isCaseSensitive: false,
    keys: [
      { name: "name", weight: 1 },
      { name: "category", weight: 0.5 },
    ],
  })
    .search(query)
    .map((r) => r.item);

  blank();

  for (const command of results) $(`#${command.name}Command`).show();

  updateResultsText(results);
});

function updateResultsText(arr) {
  $("#commandError").text(
    arr.length <= 0 ? "There is nothing to see here." : ""
  );
}

setCategory.bind($(".categories li")[0])();
