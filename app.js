const jobList = document.querySelector(".jobs__list");
const filterList = document.querySelector('.filter__list');
const filterListInner = document.querySelector(".list__left");
const clearBtn = document.querySelector('.btn--clear');

let data = [];
let tags = [];

function checkTags(jobs, tag) {
  return jobs.filter((job) => {
    return (
      tag === job.role ||
      tag === job.level ||
      job.languages.includes(tag) ||
      job.tools.includes(tag)
    );
  });
}

function filterJobs() {
  console.log(tags);
  let filteredJobs = data;
  if (tags.length == 0) {
    return filteredJobs;
  } else {
    for (let tag of tags) {
      filteredJobs = checkTags(filteredJobs,tag);
    }
    return filteredJobs;
  }

}

function renderTag(text) {
  const button = document.createElement("button");
  button.classList.add("btn", "btn--selected", "delete--btn");
  button.innerText = text;
  const icon = document.createElement("span");
  icon.classList.add("icon");
  button.appendChild(icon);
  filterListInner.appendChild(button);
  filterList.style.display = "flex";
}

function renderJobs(jobs) {
  jobList.innerHTML = "";
  const fragment = document.createDocumentFragment();
  jobs.forEach((job) => {
    const jobItem = document.createElement("li");
    jobItem.classList.add("jobs__item");

    const jobItemLeft = document.createElement("div");
    jobItemLeft.classList.add("item__left");
    const img = document.createElement("img");
    img.classList.add("image");
    img.src = job.logo;
    jobItemLeft.appendChild(img);

    jobItem.appendChild(jobItemLeft);

    const jobItemCenter = document.createElement("div");
    jobItemCenter.classList.add("item__center");

    jobItem.appendChild(jobItemCenter);

    const jobItemCenterHeader = document.createElement("div");
    jobItemCenterHeader.classList.add("item__center--header");
    const name = document.createElement("h6");
    name.classList.add("name");
    name.innerText = job.company;
    jobItemCenterHeader.appendChild(name);
    if (job.new) {
      const newBadge = document.createElement("span");
      newBadge.classList.add("new");
      newBadge.innerText = "NEW!";
      jobItemCenterHeader.appendChild(newBadge);
    }
    if (job.featured) {
      const featuredBadge = document.createElement("span");
      featuredBadge.classList.add("featured");
      featuredBadge.innerText = "FEATURED";
      jobItemCenterHeader.appendChild(featuredBadge);
    }

    jobItemCenter.appendChild(jobItemCenterHeader);

    const jobItemCenterBody = document.createElement("div");
    jobItemCenterBody.classList.add("item__center--body");
    const title = document.createElement("h4");
    title.classList.add("title");
    title.innerText = job.position;
    jobItemCenterBody.appendChild(title);

    jobItemCenter.appendChild(jobItemCenterBody);

    const jobItemCenterFooter = document.createElement("div");
    jobItemCenterFooter.classList.add("item__center--footer");
    const postedAt = document.createElement("span");
    postedAt.innerText = job.postedAt;
    jobItemCenterFooter.appendChild(postedAt);
    const contract = document.createElement("span");
    contract.innerText = job.contract;
    jobItemCenterFooter.appendChild(contract);
    const location = document.createElement("span");
    location.innerText = job.location;
    jobItemCenterFooter.appendChild(location);

    jobItemCenter.appendChild(jobItemCenterFooter);

    const jobItemRight = document.createElement("div");
    jobItemRight.classList.add("item__right");
    const role = document.createElement("button");
    role.classList.add("btn", "btn--primary", "filter--btn");
    role.setAttribute("value", job.role);
    role.setAttribute("filter-type", "role");
    role.innerText = job.role;
    jobItemRight.appendChild(role);
    const level = document.createElement("button");
    level.classList.add("btn", "btn--primary", "filter--btn");
    level.setAttribute("value", job.level);
    level.setAttribute("filter-type", "level");
    level.innerText = job.level;
    jobItemRight.appendChild(level);
    for (let language of job.languages) {
      const lang = document.createElement("button");
      lang.classList.add("btn", "btn--primary", "filter--btn");
      lang.innerText = language;
      jobItemRight.appendChild(lang);
    }
    for (let stack of job.tools) {
      const tool = document.createElement("button");
      tool.classList.add("btn", "btn--primary", "filter--btn");
      tool.innerText = stack;
      jobItemRight.appendChild(tool);
    }

    jobItem.appendChild(jobItemRight);
    fragment.appendChild(jobItem);
  });
  jobList.appendChild(fragment);
}

async function getJobs() {
  let url = "/data.json";
  try {
    let res = await fetch(url);
    data = await res.json();
    renderJobs(data);
  } catch (error) {
    console.log(error);
  }
}

jobList.addEventListener("click", function (e) {
  if (e.target.classList.contains("filter--btn")) {
    if (!tags.includes(e.target.innerText)) {
      renderTag(e.target.innerText);
      tags.push(e.target.innerText);
      const newJobsData = filterJobs();
      renderJobs(newJobsData);
    }
  }
});

filterListInner.addEventListener('click', function(e){
    if(e.target.classList.contains('delete--btn')){
        e.target.remove();
        tags = tags.filter(tag => tag !== e.target.innerText);
        const newJobsData = filterJobs();
        renderJobs(newJobsData);
    }
    if(tags.length == 0){
        filterList.style.display = 'none';
    }
})

clearBtn.addEventListener('click', function(){
    tags = [];
    filterListInner.innerHTML = ''
    filterList.style.display = 'none';
    renderJobs(data);
})



getJobs();
