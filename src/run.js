import express from "express";

const port = 3000
const web = "web";

let nextId = 1;
const zmones = [
    {
        id: nextId++,
        vardas: "Jonas",
        pavarde: "Jonaitis",
        alga: 7234.56
    },
    {
        id: nextId++,
        vardas: "Petras",
        pavarde: "Petraitis",
        alga: 750
    },
    {
        id: nextId++,
        vardas: "Antanas",
        pavarde: "Antanaitis",
        alga: 750,
    },
];

const app = express();

// TIKRINADAMAS SITA TAISYKLE JEIGU JI ATITINKA REIKALAVIMA ZEMIAU NEBETIKRINA , KITU ATVEJU -TIKRINA ZEMIAU ESANCIAS TAISYKLES
app.use(express.static(web, {
    index: "index.html"
    // GALIMA NURODYTI IR DAUGIAU REIKALAVIMU  INDEX, JEIGU PVZ, NETYCIA VIENO IS FAILU IESKOMU NEBUTU, TAIM REIKTU RASYTI index: ["index.html", "failas.html"]
}));
// MIDLE WAR SUKURIMAS
app.use(express.urlencoded({
    extended: true,
}));
// extended reiskias jog moka naudotis nauja sintakse, viska padaro stringu
// CIA YRA ENT POINTAI: jeigu pasakei / atspausdins hello world
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// CIA YRA ENT POINTAI: jeigu pasakei /index.html / atspausdins Labas pasauli
app.get('/index.html', (req, res) => {
    res.send("<html><body>Labas pasauli!</body></html>");
});
// SUKURIAMAS ENT POINTAS I ZMONIU SARA
app.get('/zmones', (req, res) => {
    let html = "";
    html += "<html>\r\n";
    html += "<body>\r\n";
    html += "<h1>Žmonių sąrašas</h1>\r\n";
    html += `<a href = "/zmogusEdit">Naujas</a>\r\n`;
    html += "<ul>\r\n";
    for (const zmogus of zmones) {
        html +=
            `<li>
            <a href="/zmogusEdit?id=${zmogus.id}">${zmogus.id}${zmogus.vardas} ${zmogus.pavarde}</a> ${zmogus.alga} 
        <a href = "/zmogusDelete?id=${zmogus.id}">&#10005</a>
        </li>`;
        // NURODOMI PARAMETRAI ? ID = .....
    }
    html += "</ul>\r\n";
    html += "</body>";
    html += "</html>";
    res.send(html);
});

app.get('/zmogusEdit', (req, res) => {
    let zmogus;
    if (req.query.id) {
        // REDAGUOTI ESAMA FORMA
        const id = parseInt(req.query.id);
        // NURODOA I NORIMA KOREAGUOTI ZMOGU IS SARASO
        zmogus = zmones.find(e => e.id === id);
        if (!zmogus) {
            res.redirect("/zmones");
            return;
        }
    }
    // jei zmogus yra undefined - vadinasi kursim nauja
    // jei zmogus rodo i objekta - redaguosim
    let html = "";
    html += "<html>\r\n";
    html += "<body>\r\n";
    html += "<h1>Naujas žmogus</h1>\r\n";
    html += `<form action="/zmogusSave" method="POST">\r\n`;
    if (zmogus) {
        html += `<input type="hidden" name="id" value="${zmogus.id}"><br>\r\n`;
    }
    html += `Vardas: <input type = "text" name="vardas" value="${(zmogus) ? zmogus.vardas : ""}"><br>\r\n`;
    html += `Pavardė: <input type = "text" name="pavarde" value=${(zmogus) ? zmogus.pavarde : ""}><br>\r\n`;
    html += `Alga: <input type = "text" name="alga" value=${(zmogus) ? zmogus.alga : ""}><br>\r\n`;
    html += '<input type = "submit" value="Save"><br>\r\n';
    html += '</form>\r\n';
    html += `<a href = "/zmones">Atgal</a>\r\n`;
    html += "</body>";
    html += "</html>";
    res.send(html);
});

app.post("/zmogusSave", (req, res) => {
    let zmogus;
    if (req.body.id) {
        const id = parseInt(req.body.id);
        zmogus = zmones.find(e => e.id === id);
        if (!zmogus) {
            res.redirect("/zmones");
            return;
        }
    }
    // PATIKRINAMI DUOMENYS BEI KLAIDOS
    let klaidos = [];
    if (!req.body.vardas || req.body.vardas.trim() === "") {
        klaidos.push("Neivestas vardas");
    }
    if (!req.body.pavarde || req.body.pavarde.trim() === "") {
        klaidos.push("Neivesta pavarde");
    }
    let alga = parseFloat(req.body.alga);
    if (isNaN(alga)) {
        klaidos.push("Neteisingai ivesta alga");
    }
    if (klaidos.length > 0) {
        let html = "";
        html += "<html>\r\n";
        html += "<body>\r\n";
        html += "<h1>Blogi duomenys</h1>\r\n";
        html += "<h2> " + klaidos + "</h2>\r\n";
        html += `<a href = "/zmogusEdit${(zmogus)? "/?id=" + zmogus.id : ""}">Atgal</a>\r\n`;
        html += "</body>";
        html += "</html>";
        res.send(html);
    } else {
        if (zmogus) {
            zmogus.vardas = req.body.vardas;
            zmogus.pavarde = req.body.pavarde;
            zmogus.alga = req.body.alga;
        } else {
            zmones.push({
                id: nextId++,
                vardas: req.body.vardas,
                pavarde: req.body.pavarde,
                alga,
            });
        }
        res.redirect("/zmones");
    }
});

// NORINT ISTRINTI IS SARASO VIENA IS ZMONIU = 1. REIKIA PRIDETI MYGTUKA.
// KAIP SERVERIUI PASAKYTI KURI ZMOGU ISTRINTI? KIEKVIENAM ZMOGUI PRIDESIM ID ELEMENTA.

app.get("/zmogusDelete", (req, res) => {
    const id = parseInt(req.query.id);
    // NURODOA I NORIMA ISTRINTI ZMOGU IS SARASO
    const index = zmones.findIndex(e => e.id === id);
    if (index >= 0) {
        zmones.splice(index, 1);
    }
    // KA REIKIA NUSIUSTI ATGAL JOG ZMOGUS ISTRINTAS?
    res.send("istrynem");
    console.log("Kazka nori istrinti");
    // RESPONSE GALI NENUSIUSTI TEKSTA JOG ISTRYNEM BET:
    // res.send("nieko mes neistrynem");
    res.redirect("/zmones");
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
