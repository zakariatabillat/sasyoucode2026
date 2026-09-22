const progression = require("./progress.js");
const studentsData = require("./data.js");
const prompt = require("prompt-sync")();


function afficherMenu() {

    console.log("\n========== SAS PROGRESS CONSOLE ==========");
    console.log("1. Afficher le tableau de bord");
    console.log("2. Afficher la liste des apprenants");
    console.log("3. Ajouter un apprenant");
    console.log("4. Consulter un apprenant par identifiant");
    console.log("5. Ajouter ou modifier le résultat d'une journée");
    console.log("6. Rechercher un apprenant par nom");
    console.log("7. Filtrer les apprenants par niveau");
    console.log("8. Trier les apprenants par progression décroissante");
    console.log("9. Trier les apprenants par ordre alphabétique");
    console.log("0. Quitter");
    console.log("==========================================");
}



let choix = "";

while (choix !== "0") {

    afficherMenu();

    choix = prompt("Votre choix : ");


    if (choix === "1") {

        progression.afficherTableauDeBord();
    }


    else if (choix === "2") {

        console.log("\n--- Liste des apprenants ---");

        for (let student of studentsData) {

            console.log(
                "ID :", student.id,
                "| Nom :", student.name,
                "| Ville :", student.city
            );
        }
    }


    else if (choix === "3") {

        const id = Number(prompt("ID : "));
        const name = prompt("Nom : ");
        const city = prompt("Ville : ");

        const success = progression.ajouterApprenant(id, name, city);

        if (success) {
            console.log("Apprenant ajouté avec succès.");
        } else {
            console.log("Erreur : cet ID existe déjà.");
        }
    }


    else if (choix === "4") {

        const id = Number(prompt("Identifiant de l'apprenant : "));

        const student = studentsData.find(function (student) {
            return student.id === id;
        });

        if (!student) {

            console.log("Apprenant introuvable.");

        } else {

            console.log("\n--- Informations de l'apprenant ---");

            console.log("ID :", student.id);
            console.log("Nom :", student.name);
            console.log("Ville :", student.city);

            console.log("Progression :",
                progression.calculerProgression(student.id).toFixed(2) + "%"
            );

            console.log("Résultats :");

            for (let result of student.results) {

                console.log(
                    "Jour :", result.jour,
                    "| Exercices :", result.exercicesTermines + "/" + result.totalExercices,
                    "| Challenge :", result.challengeTermine
                );
            }
        }
    }


    else if (choix === "5") {

        const id = Number(prompt("Identifiant de l'apprenant : "));
        const jour = Number(prompt("Jour (1-7) : "));
        const exercicesTermines = Number(prompt("Exercices terminés : "));
        const totalExercices = Number(prompt("Total exercices : "));
        const challenge = prompt("Challenge terminé ? (oui/non) ");

        let challengeTermine = false;

        if (challenge.toLowerCase() === "oui") {
            challengeTermine = true;
        }

        const resultat = {
            jour: jour,
            exercicesTermines: exercicesTermines,
            totalExercices: totalExercices,
            challengeTermine: challengeTermine
        };

        const success = progression.enregistrerResultat(id, resultat);

        if (success) {
            console.log("Résultat enregistré avec succès.");
        } else {
            console.log("Erreur : résultat non enregistré.");
        }
    }


    else if (choix === "6") {

        const recherche = prompt("Nom à rechercher : ");

        const resultats = progression.rechercherApprenant(recherche);

        if (resultats.length === 0) {

            console.log("Aucun apprenant trouvé.");

        } else {

            console.log("\n--- Résultats de recherche ---");

            for (let student of resultats) {

                console.log(
                    "ID :", student.id,
                    "| Nom :", student.name,
                    "| Ville :", student.city
                );
            }
        }
    }


    else if (choix === "7") {

        console.log("\nChoisissez un niveau :");
        console.log("1. Solid");
        console.log("2. In Progress");
        console.log("3. Needs Reinforcement");

        const niveauChoix = prompt("Votre choix : ");

        let niveau;

        if (niveauChoix === "1") {
            niveau = "Solid";
        } else if (niveauChoix === "2") {
            niveau = "In Progress";
        } else if (niveauChoix === "3") {
            niveau = "Needs Reinforcement";
        }

        if (!niveau) {

            console.log("Choix invalide.");

        } else {

            const resultats = progression.filtrerParNiveau(niveau);

            console.log("\n--- Apprenants :", niveau, "---");

            for (let student of resultats) {

                console.log(
                    "ID :", student.id,
                    "| Nom :", student.name,
                    "| Progression :",
                    progression.calculerProgression(student.id).toFixed(2) + "%"
                );
            }
        }
    }


    else if (choix === "8") {

        const resultats = progression.trierParProgression(studentsData);

        console.log("\n--- Progression décroissante ---");

        for (let student of resultats) {

            console.log(
                student.name,
                "→",
                progression.calculerProgression(student.id).toFixed(2) + "%"
            );
        }
    }


    else if (choix === "9") {

        const resultats = [...studentsData];

        resultats.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });

        console.log("\n--- Ordre alphabétique ---");

        for (let student of resultats) {

            console.log(
                "ID :", student.id,
                "| Nom :", student.name,
                "| Ville :", student.city
            );
        }
    }


    else if (choix === "0") {

        console.log("Au revoir !");
    }


    else {

        console.log("Choix invalide. Veuillez choisir entre 0 et 9.");
    }
}