const departments = {
  cse: { title: "Computer Science<br><em>&amp; Engineering</em>", copy: "Turn logic, creativity and code into products, platforms and solutions that matter.", detail: "Learn through programming, systems, data structures, software engineering and real-world projects with strong faculty guidance." },
  aiml: { title: "CSE — AI &amp;<br><em>Machine Learning</em>", copy: "Explore intelligent systems that learn, adapt and make a meaningful difference.", detail: "Build a foundation in machine learning, statistics, computer vision, natural language processing and responsible AI." },
  ece: { title: "Electronics &amp;<br><em>Communication</em>", copy: "Design the connected systems that keep people, products and possibilities moving.", detail: "Move from circuits and signals to embedded systems, communication networks, IoT and applied electronics." },
  eee: { title: "Electrical &amp;<br><em>Electronics</em>", copy: "Power the transition to a cleaner, smarter and more resilient world.", detail: "Study electrical machines, power systems, control, renewable energy and electronics through practice-led learning." },
  civil: { title: "<em>Civil</em><br>Engineering", copy: "Shape the infrastructure and spaces that make communities thrive.", detail: "Explore structural design, construction, transportation, environmental engineering and sustainable built environments." },
  ise: { title: "Information<br><em>Science</em>", copy: "Bring people, information and technology together to solve complex problems.", detail: "Develop skills in information systems, databases, web technologies, cybersecurity and applied software development." },
  mechanical: { title: "<em>Mechanical</em><br>Engineering", copy: "Imagine, model and manufacture the machines of tomorrow.", detail: "Build expertise across design, manufacturing, thermal systems, automation and product innovation." }
};
const key = new URLSearchParams(location.search).get("dept") || "cse";
const data = departments[key] || departments.cse;
document.title = `${data.title.replace(/<[^>]+>/g, "")} | SKSVMACET`;
document.querySelector("#department-title").innerHTML = data.title;
document.querySelector("#department-copy").textContent = data.copy;
document.querySelector("#department-details").innerHTML = `<p>${data.detail}</p><ul><li><span>01</span> Practice-led curriculum</li><li><span>02</span> Faculty-guided projects</li><li><span>03</span> Industry-ready skills</li></ul>`;
document.querySelector("#year").textContent = new Date().getFullYear();
