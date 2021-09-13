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
];

const app = express();

// TIKRINADAMAS SITA TAISYKLE JEIGU JI ATITINKA REIKALAVIMA ZEMIAU NEBETIKRINA , KITU ATVEJU -TIKRINA ZEMIAU ESANCIAS TAISYKLES
app.use(express.static(web, {
    index: "index.html"
    //   GALIMA NURODYTI IR DAUGIAU REIKALAVIMU  INDEX, JEIGU PVZ, NETYCIA VIENO IS FAILU IESKOMU NEBUTU, TAIM REIKTU RASYTI index: ["index.html", "failas.html"]
}));

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
    html += `<a href = "/naujas">Naujas</a>\r\n`;
    html += "<ul>\r\n";
    for (const zmogus of zmones) {
        html +=
            `<li>${zmogus.id}${zmogus.vardas} ${zmogus.pavarde} ${zmogus.alga} 
        <a href = "/zmogusDelete?id=${zmogus.id}">&#10005</a>
        </li>`;
        // NURODOMI PARAMETRAI ? ID = .....
    }
    html += "</ul>\r\n";
    html += "</body>";
    html += "</html>";
    res.send(html);
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
