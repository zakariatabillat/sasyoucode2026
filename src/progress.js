const studentsData = require("./data.js");




function normaliserNom(nom) {
    return nom.trim().replace(/\s+/g, " ").toLowerCase();
}



function validerResultat(resultat) {
    if (resultat.jour < 1 || resultat.jour > 7) {
        console.log("Erreur : le jour doit être compris entre 1 et 7.");
        return false;
    }

    if (resultat.exercicesTermines > resultat.totalExercices) {
        console.log("Erreur : les exercices terminés ne peuvent pas dépasser le total.");
        return false;
    }


    return true;
}


