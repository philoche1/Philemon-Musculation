import React, { useState, useEffect, useCallback, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const DEFAULT_DATA = {"exercises": [{"id": "ex1", "zone": "WARM UP", "groupe": "Quadriceps", "nom": "Fente TRX"}, {"id": "ex2", "zone": "WARM UP", "groupe": "Quadriceps", "nom": "Squat"}, {"id": "ex3", "zone": "WARM UP", "groupe": "Ischios", "nom": "RDL"}, {"id": "ex4", "zone": "WARM UP", "groupe": "Dos", "nom": "Trx tirage"}, {"id": "ex5", "zone": "WARM UP", "groupe": "Épaules", "nom": "Rota/lat/fly"}, {"id": "ex6", "zone": "WARM UP", "groupe": "Obliques", "nom": "Bucheron"}, {"id": "ex7", "zone": "WARM UP", "groupe": "Gainage", "nom": "g 3 trx+G"}, {"id": "ex8", "zone": "BAS DU CORPS", "groupe": "Fessiers\nQuadriceps", "nom": "Press fente"}, {"id": "ex9", "zone": "BAS DU CORPS", "groupe": "Fessiers\nQuadriceps", "nom": "Press squat"}, {"id": "ex10", "zone": "BAS DU CORPS", "groupe": "Fessiers\nQuadriceps", "nom": "Hack squat"}, {"id": "ex11", "zone": "BAS DU CORPS", "groupe": "Fessiers\nQuadriceps", "nom": "Power runner"}, {"id": "ex12", "zone": "BAS DU CORPS", "groupe": "Fessiers\nIshios", "nom": "Hip thrust"}, {"id": "ex13", "zone": "BAS DU CORPS", "groupe": "Fessiers\nIshios", "nom": "Smith lift"}, {"id": "ex14", "zone": "BAS DU CORPS", "groupe": "Abducteurs", "nom": "Abduction"}, {"id": "ex15", "zone": "BAS DU CORPS", "groupe": "Abducteurs", "nom": "Abduction\nunilatérale"}, {"id": "ex16", "zone": "BAS DU CORPS", "groupe": "Adducteurs", "nom": "Adduction"}, {"id": "ex17", "zone": "BAS DU CORPS", "groupe": "Adducteurs", "nom": "Adduction unilatérale"}, {"id": "ex18", "zone": "BAS DU CORPS", "groupe": "Ischios", "nom": "Leg curl"}, {"id": "ex19", "zone": "BAS DU CORPS", "groupe": "Ischios", "nom": "Leg curl\nunilatéral"}, {"id": "ex20", "zone": "BAS DU CORPS", "groupe": "Ischios", "nom": "Box leg curl"}, {"id": "ex21", "zone": "BAS DU CORPS", "groupe": "Quadriceps", "nom": "Leg extension"}, {"id": "ex22", "zone": "BAS DU CORPS", "groupe": "Quadriceps", "nom": "Leg extension unilatéral"}, {"id": "ex23", "zone": "BAS DU CORPS", "groupe": "Mollets", "nom": "Calf Press"}, {"id": "ex24", "zone": "HAUT DU CORPS", "groupe": "Dos", "nom": "Tirage vertical"}, {"id": "ex25", "zone": "HAUT DU CORPS", "groupe": "Dos", "nom": "Tirage horizontal"}, {"id": "ex26", "zone": "HAUT DU CORPS", "groupe": "Dos", "nom": "Tirage horizontal unilatéral"}, {"id": "ex27", "zone": "HAUT DU CORPS", "groupe": "Dos", "nom": "Tirage diagonale"}, {"id": "ex28", "zone": "HAUT DU CORPS", "groupe": "Dos", "nom": "Traction délestée"}, {"id": "ex29", "zone": "HAUT DU CORPS", "groupe": "Dos", "nom": "Reverse fly"}, {"id": "ex30", "zone": "HAUT DU CORPS", "groupe": "Pectoraux", "nom": "Dips délestée"}, {"id": "ex31", "zone": "HAUT DU CORPS", "groupe": "Pectoraux", "nom": "Chest press"}, {"id": "ex32", "zone": "HAUT DU CORPS", "groupe": "Pectoraux", "nom": "Chest press incliné"}, {"id": "ex33", "zone": "HAUT DU CORPS", "groupe": "Pectoraux", "nom": "Fly"}, {"id": "ex34", "zone": "HAUT DU CORPS", "groupe": "Pectoraux", "nom": "Butterfly"}, {"id": "ex35", "zone": "HAUT DU CORPS", "groupe": "Épaules", "nom": "Shoulder press"}, {"id": "ex36", "zone": "HAUT DU CORPS", "groupe": "Épaules", "nom": "Elévation latérale"}, {"id": "ex37", "zone": "HAUT DU CORPS", "groupe": "Épaules", "nom": "Elévation postérieure"}, {"id": "ex38", "zone": "HAUT DU CORPS", "groupe": "Biceps", "nom": "Biceps curl droit\nsuppination\nneutre\npronation"}, {"id": "ex39", "zone": "HAUT DU CORPS", "groupe": "Biceps", "nom": "Biceps curl incliné\nsuppination\nneutre\npronation"}, {"id": "ex40", "zone": "HAUT DU CORPS", "groupe": "Triceps", "nom": "Extension triceps coude haut\nsuppination\nneutre\npronation"}, {"id": "ex41", "zone": "HAUT DU CORPS", "groupe": "Triceps", "nom": "Extension triceps coude milieu\nsuppination\nneutre\npronation"}, {"id": "ex42", "zone": "CENTRE DU CORPS", "groupe": "Grand dorit iso", "nom": "Gainage frontal"}, {"id": "ex43", "zone": "CENTRE DU CORPS", "groupe": "Obliques iso", "nom": "Gainage latéral"}, {"id": "ex44", "zone": "CENTRE DU CORPS", "groupe": "Erecteur iso", "nom": "Gainage dorsal"}, {"id": "ex45", "zone": "CENTRE DU CORPS", "groupe": "Obliques\ndynamique", "nom": "Oblique debout"}, {"id": "ex46", "zone": "CENTRE DU CORPS", "groupe": "Obliques\nanti inclinaison", "nom": "Farmer walk"}, {"id": "ex47", "zone": "CENTRE DU CORPS", "groupe": "Transverse", "nom": "Hypopression"}, {"id": "ex48", "zone": "CENTRE DU CORPS", "groupe": "Erecteurs\nanti rotation", "nom": "Bird dog"}], "seanceTypes": [{"id": "st1", "nom": "Full body B", "exerciceIds": ["ex1", "ex4", "ex7", "ex12", "ex14", "ex16", "ex31", "ex42", "ex43"]}, {"id": "st2", "nom": "Full body D", "exerciceIds": ["ex1", "ex12", "ex16", "ex18", "ex31", "ex44", "ex45"]}, {"id": "st3", "nom": "Full body A", "exerciceIds": ["ex2", "ex3", "ex5", "ex9", "ex18", "ex21", "ex23", "ex27", "ex42", "ex44"]}, {"id": "st4", "nom": "Full body C", "exerciceIds": ["ex2", "ex8", "ex14", "ex21", "ex23", "ex25", "ex46", "ex48"]}, {"id": "st5", "nom": "Lower quad/abd/calf", "exerciceIds": ["ex8", "ex14", "ex21", "ex23"]}, {"id": "st6", "nom": "Lower full", "exerciceIds": ["ex8", "ex12", "ex14", "ex17"]}, {"id": "st7", "nom": "Lower quad", "exerciceIds": ["ex9", "ex12", "ex21", "ex23", "ex24", "ex42", "ex46"]}, {"id": "st8", "nom": "Lower quad/ham/calf", "exerciceIds": ["ex9", "ex18", "ex21", "ex23"]}, {"id": "st9", "nom": "Lower quad/calf/glute", "exerciceIds": ["ex9", "ex12", "ex21", "ex23"]}, {"id": "st10", "nom": "Lower glut/add/abd", "exerciceIds": ["ex12", "ex14", "ex16"]}, {"id": "st11", "nom": "Lower Ham/add/glute", "exerciceIds": ["ex12", "ex16", "ex18"]}, {"id": "st12", "nom": "Lower ham", "exerciceIds": ["ex14", "ex16", "ex18", "ex34"]}, {"id": "st13", "nom": "Lower ham/Add/Abd", "exerciceIds": ["ex14", "ex16", "ex18"]}, {"id": "st14", "nom": "Upper pull", "exerciceIds": ["ex25", "ex27", "ex29", "ex36"]}, {"id": "st15", "nom": "Upper push/pull", "exerciceIds": ["ex26", "ex27", "ex31", "ex36"]}, {"id": "st16", "nom": "Upper push", "exerciceIds": ["ex31", "ex32", "ex33", "ex36"]}], "programs": [{"id": "pr1", "nom": "Programme lower A", "seanceTypeIds": ["st8", "st10"]}, {"id": "pr2", "nom": "Programme lower B", "seanceTypeIds": ["st5", "st11"]}, {"id": "pr3", "nom": "Programme lower C", "seanceTypeIds": ["st9", "st13"]}, {"id": "pr4", "nom": "Programme full body 1", "seanceTypeIds": ["st3", "st1"]}, {"id": "pr5", "nom": "Programme full body 2", "seanceTypeIds": ["st4", "st2"]}, {"id": "pr6", "nom": "Programme upper", "seanceTypeIds": ["st14", "st16"]}, {"id": "pr7", "nom": "Programme upper/lower", "seanceTypeIds": ["st6", "st15"]}, {"id": "pr8", "nom": "Programme push/pull/leg", "seanceTypeIds": ["st6", "st14", "st16"]}, {"id": "pr9", "nom": "Programme 2 lower/1 upper", "seanceTypeIds": ["st8", "st10", "st15"]}], "sessions": [{"id": "se1", "date": "2026-07-20", "entries": [{"exerciceId": "ex1", "serie": 1, "reps": 12, "charge": 8}, {"exerciceId": "ex2", "serie": 1, "reps": 12, "charge": 20}, {"exerciceId": "ex3", "serie": 1, "reps": 12, "charge": 20}, {"exerciceId": "ex4", "serie": 1, "reps": 12, "charge": 10}, {"exerciceId": "ex5", "serie": 1, "reps": 15, "charge": 5}, {"exerciceId": "ex6", "serie": 1, "reps": 15, "charge": 8}, {"exerciceId": "ex7", "serie": 1, "reps": 12, "charge": 5}, {"exerciceId": "ex8", "serie": 1, "reps": 15, "charge": 40}, {"exerciceId": "ex8", "serie": 2, "reps": 15, "charge": 40}, {"exerciceId": "ex8", "serie": 3, "reps": 12, "charge": 42}, {"exerciceId": "ex8", "serie": 4, "reps": 12, "charge": 42}, {"exerciceId": "ex9", "serie": 1, "reps": 15, "charge": 60}, {"exerciceId": "ex9", "serie": 2, "reps": 15, "charge": 60}, {"exerciceId": "ex9", "serie": 3, "reps": 12, "charge": 62}, {"exerciceId": "ex9", "serie": 4, "reps": 12, "charge": 62}, {"exerciceId": "ex10", "serie": 1, "reps": 15, "charge": 45}, {"exerciceId": "ex10", "serie": 2, "reps": 15, "charge": 45}, {"exerciceId": "ex10", "serie": 3, "reps": 12, "charge": 47}, {"exerciceId": "ex10", "serie": 4, "reps": 12, "charge": 47}, {"exerciceId": "ex11", "serie": 1, "reps": 15, "charge": 30}, {"exerciceId": "ex11", "serie": 2, "reps": 15, "charge": 30}, {"exerciceId": "ex11", "serie": 3, "reps": 12, "charge": 32}, {"exerciceId": "ex11", "serie": 4, "reps": 12, "charge": 32}, {"exerciceId": "ex12", "serie": 1, "reps": 15, "charge": 50}, {"exerciceId": "ex12", "serie": 2, "reps": 15, "charge": 50}, {"exerciceId": "ex12", "serie": 3, "reps": 12, "charge": 52}, {"exerciceId": "ex12", "serie": 4, "reps": 12, "charge": 52}, {"exerciceId": "ex13", "serie": 1, "reps": 15, "charge": 30}, {"exerciceId": "ex13", "serie": 2, "reps": 15, "charge": 30}, {"exerciceId": "ex13", "serie": 3, "reps": 12, "charge": 32}, {"exerciceId": "ex13", "serie": 4, "reps": 12, "charge": 32}, {"exerciceId": "ex14", "serie": 1, "reps": 15, "charge": 35}, {"exerciceId": "ex14", "serie": 2, "reps": 15, "charge": 35}, {"exerciceId": "ex14", "serie": 3, "reps": 12, "charge": 37}, {"exerciceId": "ex14", "serie": 4, "reps": 12, "charge": 37}, {"exerciceId": "ex16", "serie": 1, "reps": 15, "charge": 35}, {"exerciceId": "ex16", "serie": 2, "reps": 15, "charge": 35}, {"exerciceId": "ex16", "serie": 3, "reps": 12, "charge": 37}, {"exerciceId": "ex16", "serie": 4, "reps": 12, "charge": 37}, {"exerciceId": "ex18", "serie": 1, "reps": 15, "charge": 20}, {"exerciceId": "ex18", "serie": 2, "reps": 15, "charge": 20}, {"exerciceId": "ex18", "serie": 3, "reps": 12, "charge": 22}, {"exerciceId": "ex18", "serie": 4, "reps": 12, "charge": 22}, {"exerciceId": "ex20", "serie": 1, "reps": 15, "charge": 25}, {"exerciceId": "ex20", "serie": 2, "reps": 15, "charge": 25}, {"exerciceId": "ex20", "serie": 3, "reps": 12, "charge": 27}, {"exerciceId": "ex20", "serie": 4, "reps": 12, "charge": 27}, {"exerciceId": "ex21", "serie": 1, "reps": 15, "charge": 30}, {"exerciceId": "ex21", "serie": 2, "reps": 15, "charge": 30}, {"exerciceId": "ex21", "serie": 3, "reps": 12, "charge": 32}, {"exerciceId": "ex21", "serie": 4, "reps": 12, "charge": 32}, {"exerciceId": "ex23", "serie": 1, "reps": 15, "charge": 60}, {"exerciceId": "ex23", "serie": 2, "reps": 15, "charge": 60}, {"exerciceId": "ex23", "serie": 3, "reps": 12, "charge": 62}, {"exerciceId": "ex23", "serie": 4, "reps": 12, "charge": 62}, {"exerciceId": "ex24", "serie": 1, "reps": 15, "charge": 35}, {"exerciceId": "ex24", "serie": 2, "reps": 15, "charge": 35}, {"exerciceId": "ex24", "serie": 3, "reps": 12, "charge": 37}, {"exerciceId": "ex24", "serie": 4, "reps": 12, "charge": 37}, {"exerciceId": "ex25", "serie": 1, "reps": 15, "charge": 35}, {"exerciceId": "ex25", "serie": 2, "reps": 15, "charge": 35}, {"exerciceId": "ex25", "serie": 3, "reps": 12, "charge": 37}, {"exerciceId": "ex25", "serie": 4, "reps": 12, "charge": 37}, {"exerciceId": "ex27", "serie": 1, "reps": 15, "charge": 25}, {"exerciceId": "ex27", "serie": 2, "reps": 15, "charge": 25}, {"exerciceId": "ex27", "serie": 3, "reps": 12, "charge": 27}, {"exerciceId": "ex27", "serie": 4, "reps": 12, "charge": 27}, {"exerciceId": "ex28", "serie": 1, "reps": 15, "charge": 25}, {"exerciceId": "ex28", "serie": 2, "reps": 15, "charge": 25}, {"exerciceId": "ex28", "serie": 3, "reps": 12, "charge": 27}, {"exerciceId": "ex28", "serie": 4, "reps": 12, "charge": 27}, {"exerciceId": "ex29", "serie": 1, "reps": 15, "charge": 12}, {"exerciceId": "ex29", "serie": 2, "reps": 15, "charge": 12}, {"exerciceId": "ex29", "serie": 3, "reps": 12, "charge": 13}, {"exerciceId": "ex29", "serie": 4, "reps": 12, "charge": 13}, {"exerciceId": "ex30", "serie": 1, "reps": 15, "charge": 20}, {"exerciceId": "ex30", "serie": 2, "reps": 15, "charge": 20}, {"exerciceId": "ex30", "serie": 3, "reps": 12, "charge": 22}, {"exerciceId": "ex30", "serie": 4, "reps": 12, "charge": 22}, {"exerciceId": "ex31", "serie": 1, "reps": 15, "charge": 25}, {"exerciceId": "ex31", "serie": 2, "reps": 15, "charge": 25}, {"exerciceId": "ex31", "serie": 3, "reps": 12, "charge": 27}, {"exerciceId": "ex31", "serie": 4, "reps": 12, "charge": 27}, {"exerciceId": "ex33", "serie": 1, "reps": 15, "charge": 15}, {"exerciceId": "ex33", "serie": 2, "reps": 15, "charge": 15}, {"exerciceId": "ex33", "serie": 3, "reps": 12, "charge": 16}, {"exerciceId": "ex33", "serie": 4, "reps": 12, "charge": 16}, {"exerciceId": "ex34", "serie": 1, "reps": 15, "charge": 20}, {"exerciceId": "ex34", "serie": 2, "reps": 15, "charge": 20}, {"exerciceId": "ex34", "serie": 3, "reps": 12, "charge": 22}, {"exerciceId": "ex34", "serie": 4, "reps": 12, "charge": 22}, {"exerciceId": "ex36", "serie": 1, "reps": 15, "charge": 6}, {"exerciceId": "ex36", "serie": 2, "reps": 15, "charge": 6}, {"exerciceId": "ex36", "serie": 3, "reps": 12, "charge": 7}, {"exerciceId": "ex36", "serie": 4, "reps": 12, "charge": 7}, {"exerciceId": "ex42", "serie": 1, "reps": 30, "charge": 5}, {"exerciceId": "ex42", "serie": 2, "reps": 30, "charge": 5}, {"exerciceId": "ex42", "serie": 3, "reps": 25, "charge": 6}, {"exerciceId": "ex42", "serie": 4, "reps": 25, "charge": 6}, {"exerciceId": "ex43", "serie": 1, "reps": 30, "charge": 5}, {"exerciceId": "ex43", "serie": 2, "reps": 30, "charge": 5}, {"exerciceId": "ex43", "serie": 3, "reps": 25, "charge": 6}, {"exerciceId": "ex43", "serie": 4, "reps": 25, "charge": 6}, {"exerciceId": "ex44", "serie": 1, "reps": 30, "charge": 5}, {"exerciceId": "ex44", "serie": 2, "reps": 30, "charge": 5}, {"exerciceId": "ex44", "serie": 3, "reps": 25, "charge": 6}, {"exerciceId": "ex44", "serie": 4, "reps": 25, "charge": 6}, {"exerciceId": "ex45", "serie": 1, "reps": 15, "charge": 8}, {"exerciceId": "ex45", "serie": 2, "reps": 15, "charge": 8}, {"exerciceId": "ex45", "serie": 3, "reps": 12, "charge": 9}, {"exerciceId": "ex45", "serie": 4, "reps": 12, "charge": 9}, {"exerciceId": "ex46", "serie": 1, "reps": 15, "charge": 16}, {"exerciceId": "ex46", "serie": 2, "reps": 15, "charge": 16}, {"exerciceId": "ex46", "serie": 3, "reps": 12, "charge": 17}, {"exerciceId": "ex46", "serie": 4, "reps": 12, "charge": 17}, {"exerciceId": "ex47", "serie": 1, "reps": 15, "charge": 5}, {"exerciceId": "ex47", "serie": 2, "reps": 15, "charge": 5}, {"exerciceId": "ex47", "serie": 3, "reps": 12, "charge": 6}, {"exerciceId": "ex47", "serie": 4, "reps": 12, "charge": 6}, {"exerciceId": "ex48", "serie": 1, "reps": 15, "charge": 5}, {"exerciceId": "ex48", "serie": 2, "reps": 15, "charge": 5}, {"exerciceId": "ex48", "serie": 3, "reps": 12, "charge": 6}, {"exerciceId": "ex48", "serie": 4, "reps": 12, "charge": 6}]}, {"id": "se2", "date": "2026-07-23", "entries": [{"exerciceId": "ex1", "serie": 1, "reps": 12, "charge": 8}, {"exerciceId": "ex2", "serie": 1, "reps": 12, "charge": 20}, {"exerciceId": "ex3", "serie": 1, "reps": 12, "charge": 20}, {"exerciceId": "ex4", "serie": 1, "reps": 12, "charge": 10}, {"exerciceId": "ex5", "serie": 1, "reps": 15, "charge": 5}, {"exerciceId": "ex6", "serie": 1, "reps": 15, "charge": 8}, {"exerciceId": "ex7", "serie": 1, "reps": 12, "charge": 5}, {"exerciceId": "ex8", "serie": 1, "reps": 15, "charge": 40}, {"exerciceId": "ex8", "serie": 2, "reps": 15, "charge": 40}, {"exerciceId": "ex8", "serie": 3, "reps": 12, "charge": 42}, {"exerciceId": "ex8", "serie": 4, "reps": 12, "charge": 42}, {"exerciceId": "ex9", "serie": 1, "reps": 15, "charge": 60}, {"exerciceId": "ex9", "serie": 2, "reps": 15, "charge": 60}, {"exerciceId": "ex9", "serie": 3, "reps": 12, "charge": 62}, {"exerciceId": "ex9", "serie": 4, "reps": 12, "charge": 62}, {"exerciceId": "ex10", "serie": 1, "reps": 15, "charge": 45}, {"exerciceId": "ex10", "serie": 2, "reps": 15, "charge": 45}, {"exerciceId": "ex10", "serie": 3, "reps": 12, "charge": 47}, {"exerciceId": "ex10", "serie": 4, "reps": 12, "charge": 47}, {"exerciceId": "ex11", "serie": 1, "reps": 15, "charge": 30}, {"exerciceId": "ex11", "serie": 2, "reps": 15, "charge": 30}, {"exerciceId": "ex11", "serie": 3, "reps": 12, "charge": 32}, {"exerciceId": "ex11", "serie": 4, "reps": 12, "charge": 32}, {"exerciceId": "ex12", "serie": 1, "reps": 15, "charge": 50}, {"exerciceId": "ex12", "serie": 2, "reps": 15, "charge": 50}, {"exerciceId": "ex12", "serie": 3, "reps": 12, "charge": 52}, {"exerciceId": "ex12", "serie": 4, "reps": 12, "charge": 52}, {"exerciceId": "ex13", "serie": 1, "reps": 15, "charge": 30}, {"exerciceId": "ex13", "serie": 2, "reps": 15, "charge": 30}, {"exerciceId": "ex13", "serie": 3, "reps": 12, "charge": 32}, {"exerciceId": "ex13", "serie": 4, "reps": 12, "charge": 32}, {"exerciceId": "ex14", "serie": 1, "reps": 15, "charge": 35}, {"exerciceId": "ex14", "serie": 2, "reps": 15, "charge": 35}, {"exerciceId": "ex14", "serie": 3, "reps": 12, "charge": 37}, {"exerciceId": "ex14", "serie": 4, "reps": 12, "charge": 37}, {"exerciceId": "ex16", "serie": 1, "reps": 15, "charge": 35}, {"exerciceId": "ex16", "serie": 2, "reps": 15, "charge": 35}, {"exerciceId": "ex16", "serie": 3, "reps": 12, "charge": 37}, {"exerciceId": "ex16", "serie": 4, "reps": 12, "charge": 37}, {"exerciceId": "ex18", "serie": 1, "reps": 15, "charge": 20}, {"exerciceId": "ex18", "serie": 2, "reps": 15, "charge": 20}, {"exerciceId": "ex18", "serie": 3, "reps": 12, "charge": 22}, {"exerciceId": "ex18", "serie": 4, "reps": 12, "charge": 22}, {"exerciceId": "ex20", "serie": 1, "reps": 15, "charge": 25}, {"exerciceId": "ex20", "serie": 2, "reps": 15, "charge": 25}, {"exerciceId": "ex20", "serie": 3, "reps": 12, "charge": 27}, {"exerciceId": "ex20", "serie": 4, "reps": 12, "charge": 27}, {"exerciceId": "ex21", "serie": 1, "reps": 15, "charge": 30}, {"exerciceId": "ex21", "serie": 2, "reps": 15, "charge": 30}, {"exerciceId": "ex21", "serie": 3, "reps": 12, "charge": 32}, {"exerciceId": "ex21", "serie": 4, "reps": 12, "charge": 32}, {"exerciceId": "ex23", "serie": 1, "reps": 15, "charge": 60}, {"exerciceId": "ex23", "serie": 2, "reps": 15, "charge": 60}, {"exerciceId": "ex23", "serie": 3, "reps": 12, "charge": 62}, {"exerciceId": "ex23", "serie": 4, "reps": 12, "charge": 62}, {"exerciceId": "ex24", "serie": 1, "reps": 15, "charge": 35}, {"exerciceId": "ex24", "serie": 2, "reps": 15, "charge": 35}, {"exerciceId": "ex24", "serie": 3, "reps": 12, "charge": 37}, {"exerciceId": "ex24", "serie": 4, "reps": 12, "charge": 37}, {"exerciceId": "ex25", "serie": 1, "reps": 15, "charge": 35}, {"exerciceId": "ex25", "serie": 2, "reps": 15, "charge": 35}, {"exerciceId": "ex25", "serie": 3, "reps": 12, "charge": 37}, {"exerciceId": "ex25", "serie": 4, "reps": 12, "charge": 37}, {"exerciceId": "ex27", "serie": 1, "reps": 15, "charge": 25}, {"exerciceId": "ex27", "serie": 2, "reps": 15, "charge": 25}, {"exerciceId": "ex27", "serie": 3, "reps": 12, "charge": 27}, {"exerciceId": "ex27", "serie": 4, "reps": 12, "charge": 27}, {"exerciceId": "ex28", "serie": 1, "reps": 15, "charge": 25}, {"exerciceId": "ex28", "serie": 2, "reps": 15, "charge": 25}, {"exerciceId": "ex28", "serie": 3, "reps": 12, "charge": 27}, {"exerciceId": "ex28", "serie": 4, "reps": 12, "charge": 27}, {"exerciceId": "ex29", "serie": 1, "reps": 15, "charge": 12}, {"exerciceId": "ex29", "serie": 2, "reps": 15, "charge": 12}, {"exerciceId": "ex29", "serie": 3, "reps": 12, "charge": 13}, {"exerciceId": "ex29", "serie": 4, "reps": 12, "charge": 13}, {"exerciceId": "ex30", "serie": 1, "reps": 15, "charge": 20}, {"exerciceId": "ex30", "serie": 2, "reps": 15, "charge": 20}, {"exerciceId": "ex30", "serie": 3, "reps": 12, "charge": 22}, {"exerciceId": "ex30", "serie": 4, "reps": 12, "charge": 22}, {"exerciceId": "ex31", "serie": 1, "reps": 15, "charge": 25}, {"exerciceId": "ex31", "serie": 2, "reps": 15, "charge": 25}, {"exerciceId": "ex31", "serie": 3, "reps": 12, "charge": 27}, {"exerciceId": "ex31", "serie": 4, "reps": 12, "charge": 27}, {"exerciceId": "ex33", "serie": 1, "reps": 15, "charge": 15}, {"exerciceId": "ex33", "serie": 2, "reps": 15, "charge": 15}, {"exerciceId": "ex33", "serie": 3, "reps": 12, "charge": 16}, {"exerciceId": "ex33", "serie": 4, "reps": 12, "charge": 16}, {"exerciceId": "ex34", "serie": 1, "reps": 15, "charge": 20}, {"exerciceId": "ex34", "serie": 2, "reps": 15, "charge": 20}, {"exerciceId": "ex34", "serie": 3, "reps": 12, "charge": 22}, {"exerciceId": "ex34", "serie": 4, "reps": 12, "charge": 22}, {"exerciceId": "ex36", "serie": 1, "reps": 15, "charge": 6}, {"exerciceId": "ex36", "serie": 2, "reps": 15, "charge": 6}, {"exerciceId": "ex36", "serie": 3, "reps": 12, "charge": 7}, {"exerciceId": "ex36", "serie": 4, "reps": 12, "charge": 7}, {"exerciceId": "ex42", "serie": 1, "reps": 30, "charge": 5}, {"exerciceId": "ex42", "serie": 2, "reps": 30, "charge": 5}, {"exerciceId": "ex42", "serie": 3, "reps": 25, "charge": 6}, {"exerciceId": "ex42", "serie": 4, "reps": 25, "charge": 6}, {"exerciceId": "ex43", "serie": 1, "reps": 30, "charge": 5}, {"exerciceId": "ex43", "serie": 2, "reps": 30, "charge": 5}, {"exerciceId": "ex43", "serie": 3, "reps": 25, "charge": 6}, {"exerciceId": "ex43", "serie": 4, "reps": 25, "charge": 6}, {"exerciceId": "ex44", "serie": 1, "reps": 30, "charge": 5}, {"exerciceId": "ex44", "serie": 2, "reps": 30, "charge": 5}, {"exerciceId": "ex44", "serie": 3, "reps": 25, "charge": 6}, {"exerciceId": "ex44", "serie": 4, "reps": 25, "charge": 6}, {"exerciceId": "ex45", "serie": 1, "reps": 15, "charge": 8}, {"exerciceId": "ex45", "serie": 2, "reps": 15, "charge": 8}, {"exerciceId": "ex45", "serie": 3, "reps": 12, "charge": 9}, {"exerciceId": "ex45", "serie": 4, "reps": 12, "charge": 9}, {"exerciceId": "ex46", "serie": 1, "reps": 15, "charge": 16}, {"exerciceId": "ex46", "serie": 2, "reps": 15, "charge": 16}, {"exerciceId": "ex46", "serie": 3, "reps": 12, "charge": 17}, {"exerciceId": "ex46", "serie": 4, "reps": 12, "charge": 17}, {"exerciceId": "ex47", "serie": 1, "reps": 15, "charge": 5}, {"exerciceId": "ex47", "serie": 2, "reps": 15, "charge": 5}, {"exerciceId": "ex47", "serie": 3, "reps": 12, "charge": 6}, {"exerciceId": "ex47", "serie": 4, "reps": 12, "charge": 6}, {"exerciceId": "ex48", "serie": 1, "reps": 15, "charge": 5}, {"exerciceId": "ex48", "serie": 2, "reps": 15, "charge": 5}, {"exerciceId": "ex48", "serie": 3, "reps": 12, "charge": 6}, {"exerciceId": "ex48", "serie": 4, "reps": 12, "charge": 6}]}, {"id": "se3", "date": "2026-07-27", "entries": [{"exerciceId": "ex1", "serie": 1, "reps": 12, "charge": 8}, {"exerciceId": "ex2", "serie": 1, "reps": 12, "charge": 20}, {"exerciceId": "ex3", "serie": 1, "reps": 12, "charge": 20}, {"exerciceId": "ex4", "serie": 1, "reps": 12, "charge": 10}, {"exerciceId": "ex5", "serie": 1, "reps": 15, "charge": 5}, {"exerciceId": "ex6", "serie": 1, "reps": 15, "charge": 8}, {"exerciceId": "ex7", "serie": 1, "reps": 12, "charge": 5}, {"exerciceId": "ex8", "serie": 1, "reps": 15, "charge": 42}, {"exerciceId": "ex8", "serie": 2, "reps": 15, "charge": 42}, {"exerciceId": "ex8", "serie": 3, "reps": 12, "charge": 44}, {"exerciceId": "ex8", "serie": 4, "reps": 12, "charge": 44}, {"exerciceId": "ex9", "serie": 1, "reps": 15, "charge": 62}, {"exerciceId": "ex9", "serie": 2, "reps": 15, "charge": 62}, {"exerciceId": "ex9", "serie": 3, "reps": 12, "charge": 64}, {"exerciceId": "ex9", "serie": 4, "reps": 12, "charge": 64}, {"exerciceId": "ex10", "serie": 1, "reps": 15, "charge": 47}, {"exerciceId": "ex10", "serie": 2, "reps": 15, "charge": 47}, {"exerciceId": "ex10", "serie": 3, "reps": 12, "charge": 49}, {"exerciceId": "ex10", "serie": 4, "reps": 12, "charge": 49}, {"exerciceId": "ex11", "serie": 1, "reps": 15, "charge": 32}, {"exerciceId": "ex11", "serie": 2, "reps": 15, "charge": 32}, {"exerciceId": "ex11", "serie": 3, "reps": 12, "charge": 34}, {"exerciceId": "ex11", "serie": 4, "reps": 12, "charge": 34}, {"exerciceId": "ex12", "serie": 1, "reps": 15, "charge": 52}, {"exerciceId": "ex12", "serie": 2, "reps": 15, "charge": 52}, {"exerciceId": "ex12", "serie": 3, "reps": 12, "charge": 54}, {"exerciceId": "ex12", "serie": 4, "reps": 12, "charge": 54}, {"exerciceId": "ex13", "serie": 1, "reps": 15, "charge": 32}, {"exerciceId": "ex13", "serie": 2, "reps": 15, "charge": 32}, {"exerciceId": "ex13", "serie": 3, "reps": 12, "charge": 34}, {"exerciceId": "ex13", "serie": 4, "reps": 12, "charge": 34}, {"exerciceId": "ex14", "serie": 1, "reps": 15, "charge": 37}, {"exerciceId": "ex14", "serie": 2, "reps": 15, "charge": 37}, {"exerciceId": "ex14", "serie": 3, "reps": 12, "charge": 39}, {"exerciceId": "ex14", "serie": 4, "reps": 12, "charge": 39}, {"exerciceId": "ex16", "serie": 1, "reps": 15, "charge": 37}, {"exerciceId": "ex16", "serie": 2, "reps": 15, "charge": 37}, {"exerciceId": "ex16", "serie": 3, "reps": 12, "charge": 39}, {"exerciceId": "ex16", "serie": 4, "reps": 12, "charge": 39}, {"exerciceId": "ex18", "serie": 1, "reps": 15, "charge": 22}, {"exerciceId": "ex18", "serie": 2, "reps": 15, "charge": 22}, {"exerciceId": "ex18", "serie": 3, "reps": 12, "charge": 24}, {"exerciceId": "ex18", "serie": 4, "reps": 12, "charge": 24}, {"exerciceId": "ex20", "serie": 1, "reps": 15, "charge": 27}, {"exerciceId": "ex20", "serie": 2, "reps": 15, "charge": 27}, {"exerciceId": "ex20", "serie": 3, "reps": 12, "charge": 29}, {"exerciceId": "ex20", "serie": 4, "reps": 12, "charge": 29}, {"exerciceId": "ex21", "serie": 1, "reps": 15, "charge": 32}, {"exerciceId": "ex21", "serie": 2, "reps": 15, "charge": 32}, {"exerciceId": "ex21", "serie": 3, "reps": 12, "charge": 34}, {"exerciceId": "ex21", "serie": 4, "reps": 12, "charge": 34}, {"exerciceId": "ex23", "serie": 1, "reps": 15, "charge": 62}, {"exerciceId": "ex23", "serie": 2, "reps": 15, "charge": 62}, {"exerciceId": "ex23", "serie": 3, "reps": 12, "charge": 64}, {"exerciceId": "ex23", "serie": 4, "reps": 12, "charge": 64}, {"exerciceId": "ex24", "serie": 1, "reps": 15, "charge": 37}, {"exerciceId": "ex24", "serie": 2, "reps": 15, "charge": 37}, {"exerciceId": "ex24", "serie": 3, "reps": 12, "charge": 39}, {"exerciceId": "ex24", "serie": 4, "reps": 12, "charge": 39}, {"exerciceId": "ex25", "serie": 1, "reps": 15, "charge": 37}, {"exerciceId": "ex25", "serie": 2, "reps": 15, "charge": 37}, {"exerciceId": "ex25", "serie": 3, "reps": 12, "charge": 39}, {"exerciceId": "ex25", "serie": 4, "reps": 12, "charge": 39}, {"exerciceId": "ex27", "serie": 1, "reps": 15, "charge": 27}, {"exerciceId": "ex27", "serie": 2, "reps": 15, "charge": 27}, {"exerciceId": "ex27", "serie": 3, "reps": 12, "charge": 29}, {"exerciceId": "ex27", "serie": 4, "reps": 12, "charge": 29}, {"exerciceId": "ex28", "serie": 1, "reps": 15, "charge": 27}, {"exerciceId": "ex28", "serie": 2, "reps": 15, "charge": 27}, {"exerciceId": "ex28", "serie": 3, "reps": 12, "charge": 29}, {"exerciceId": "ex28", "serie": 4, "reps": 12, "charge": 29}, {"exerciceId": "ex29", "serie": 1, "reps": 15, "charge": 13}, {"exerciceId": "ex29", "serie": 2, "reps": 15, "charge": 13}, {"exerciceId": "ex29", "serie": 3, "reps": 12, "charge": 14}, {"exerciceId": "ex29", "serie": 4, "reps": 12, "charge": 14}, {"exerciceId": "ex30", "serie": 1, "reps": 15, "charge": 22}, {"exerciceId": "ex30", "serie": 2, "reps": 15, "charge": 22}, {"exerciceId": "ex30", "serie": 3, "reps": 12, "charge": 24}, {"exerciceId": "ex30", "serie": 4, "reps": 12, "charge": 24}, {"exerciceId": "ex31", "serie": 1, "reps": 15, "charge": 27}, {"exerciceId": "ex31", "serie": 2, "reps": 15, "charge": 27}, {"exerciceId": "ex31", "serie": 3, "reps": 12, "charge": 29}, {"exerciceId": "ex31", "serie": 4, "reps": 12, "charge": 29}, {"exerciceId": "ex33", "serie": 1, "reps": 15, "charge": 16}, {"exerciceId": "ex33", "serie": 2, "reps": 15, "charge": 16}, {"exerciceId": "ex33", "serie": 3, "reps": 12, "charge": 17}, {"exerciceId": "ex33", "serie": 4, "reps": 12, "charge": 17}, {"exerciceId": "ex34", "serie": 1, "reps": 15, "charge": 22}, {"exerciceId": "ex34", "serie": 2, "reps": 15, "charge": 22}, {"exerciceId": "ex34", "serie": 3, "reps": 12, "charge": 24}, {"exerciceId": "ex34", "serie": 4, "reps": 12, "charge": 24}, {"exerciceId": "ex36", "serie": 1, "reps": 15, "charge": 7}, {"exerciceId": "ex36", "serie": 2, "reps": 15, "charge": 7}, {"exerciceId": "ex36", "serie": 3, "reps": 12, "charge": 8}, {"exerciceId": "ex36", "serie": 4, "reps": 12, "charge": 8}, {"exerciceId": "ex42", "serie": 1, "reps": 33, "charge": 6}, {"exerciceId": "ex42", "serie": 2, "reps": 33, "charge": 6}, {"exerciceId": "ex42", "serie": 3, "reps": 28, "charge": 7}, {"exerciceId": "ex42", "serie": 4, "reps": 28, "charge": 7}, {"exerciceId": "ex43", "serie": 1, "reps": 33, "charge": 6}, {"exerciceId": "ex43", "serie": 2, "reps": 33, "charge": 6}, {"exerciceId": "ex43", "serie": 3, "reps": 28, "charge": 7}, {"exerciceId": "ex43", "serie": 4, "reps": 28, "charge": 7}, {"exerciceId": "ex44", "serie": 1, "reps": 33, "charge": 6}, {"exerciceId": "ex44", "serie": 2, "reps": 33, "charge": 6}, {"exerciceId": "ex44", "serie": 3, "reps": 28, "charge": 7}, {"exerciceId": "ex44", "serie": 4, "reps": 28, "charge": 7}, {"exerciceId": "ex45", "serie": 1, "reps": 15, "charge": 9}, {"exerciceId": "ex45", "serie": 2, "reps": 15, "charge": 9}, {"exerciceId": "ex45", "serie": 3, "reps": 12, "charge": 10}, {"exerciceId": "ex45", "serie": 4, "reps": 12, "charge": 10}, {"exerciceId": "ex46", "serie": 1, "reps": 15, "charge": 17}, {"exerciceId": "ex46", "serie": 2, "reps": 15, "charge": 17}, {"exerciceId": "ex46", "serie": 3, "reps": 12, "charge": 18}, {"exerciceId": "ex46", "serie": 4, "reps": 12, "charge": 18}, {"exerciceId": "ex47", "serie": 1, "reps": 15, "charge": 6}, {"exerciceId": "ex47", "serie": 2, "reps": 15, "charge": 6}, {"exerciceId": "ex47", "serie": 3, "reps": 12, "charge": 7}, {"exerciceId": "ex47", "serie": 4, "reps": 12, "charge": 7}, {"exerciceId": "ex48", "serie": 1, "reps": 15, "charge": 6}, {"exerciceId": "ex48", "serie": 2, "reps": 15, "charge": 6}, {"exerciceId": "ex48", "serie": 3, "reps": 12, "charge": 7}, {"exerciceId": "ex48", "serie": 4, "reps": 12, "charge": 7}]}, {"id": "se4", "date": "2026-07-30", "entries": [{"exerciceId": "ex1", "serie": 1, "reps": 12, "charge": 9}, {"exerciceId": "ex2", "serie": 1, "reps": 12, "charge": 22}, {"exerciceId": "ex3", "serie": 1, "reps": 12, "charge": 22}, {"exerciceId": "ex4", "serie": 1, "reps": 12, "charge": 11}, {"exerciceId": "ex5", "serie": 1, "reps": 15, "charge": 6}, {"exerciceId": "ex6", "serie": 1, "reps": 15, "charge": 9}, {"exerciceId": "ex7", "serie": 1, "reps": 12, "charge": 6}, {"exerciceId": "ex8", "serie": 1, "reps": 15, "charge": 42}, {"exerciceId": "ex8", "serie": 2, "reps": 15, "charge": 42}, {"exerciceId": "ex8", "serie": 3, "reps": 12, "charge": 44}, {"exerciceId": "ex8", "serie": 4, "reps": 12, "charge": 44}, {"exerciceId": "ex9", "serie": 1, "reps": 15, "charge": 62}, {"exerciceId": "ex9", "serie": 2, "reps": 15, "charge": 62}, {"exerciceId": "ex9", "serie": 3, "reps": 12, "charge": 64}, {"exerciceId": "ex9", "serie": 4, "reps": 12, "charge": 64}, {"exerciceId": "ex10", "serie": 1, "reps": 15, "charge": 47}, {"exerciceId": "ex10", "serie": 2, "reps": 15, "charge": 47}, {"exerciceId": "ex10", "serie": 3, "reps": 12, "charge": 49}, {"exerciceId": "ex10", "serie": 4, "reps": 12, "charge": 49}, {"exerciceId": "ex11", "serie": 1, "reps": 15, "charge": 32}, {"exerciceId": "ex11", "serie": 2, "reps": 15, "charge": 32}, {"exerciceId": "ex11", "serie": 3, "reps": 12, "charge": 34}, {"exerciceId": "ex11", "serie": 4, "reps": 12, "charge": 34}, {"exerciceId": "ex12", "serie": 1, "reps": 15, "charge": 52}, {"exerciceId": "ex12", "serie": 2, "reps": 15, "charge": 52}, {"exerciceId": "ex12", "serie": 3, "reps": 12, "charge": 54}, {"exerciceId": "ex12", "serie": 4, "reps": 12, "charge": 54}, {"exerciceId": "ex13", "serie": 1, "reps": 15, "charge": 32}, {"exerciceId": "ex13", "serie": 2, "reps": 15, "charge": 32}, {"exerciceId": "ex13", "serie": 3, "reps": 12, "charge": 34}, {"exerciceId": "ex13", "serie": 4, "reps": 12, "charge": 34}, {"exerciceId": "ex14", "serie": 1, "reps": 15, "charge": 37}, {"exerciceId": "ex14", "serie": 2, "reps": 15, "charge": 37}, {"exerciceId": "ex14", "serie": 3, "reps": 12, "charge": 39}, {"exerciceId": "ex14", "serie": 4, "reps": 12, "charge": 39}, {"exerciceId": "ex16", "serie": 1, "reps": 15, "charge": 37}, {"exerciceId": "ex16", "serie": 2, "reps": 15, "charge": 37}, {"exerciceId": "ex16", "serie": 3, "reps": 12, "charge": 39}, {"exerciceId": "ex16", "serie": 4, "reps": 12, "charge": 39}, {"exerciceId": "ex18", "serie": 1, "reps": 15, "charge": 22}, {"exerciceId": "ex18", "serie": 2, "reps": 15, "charge": 22}, {"exerciceId": "ex18", "serie": 3, "reps": 12, "charge": 24}, {"exerciceId": "ex18", "serie": 4, "reps": 12, "charge": 24}, {"exerciceId": "ex20", "serie": 1, "reps": 15, "charge": 27}, {"exerciceId": "ex20", "serie": 2, "reps": 15, "charge": 27}, {"exerciceId": "ex20", "serie": 3, "reps": 12, "charge": 29}, {"exerciceId": "ex20", "serie": 4, "reps": 12, "charge": 29}, {"exerciceId": "ex21", "serie": 1, "reps": 15, "charge": 32}, {"exerciceId": "ex21", "serie": 2, "reps": 15, "charge": 32}, {"exerciceId": "ex21", "serie": 3, "reps": 12, "charge": 34}, {"exerciceId": "ex21", "serie": 4, "reps": 12, "charge": 34}, {"exerciceId": "ex23", "serie": 1, "reps": 15, "charge": 62}, {"exerciceId": "ex23", "serie": 2, "reps": 15, "charge": 62}, {"exerciceId": "ex23", "serie": 3, "reps": 12, "charge": 64}, {"exerciceId": "ex23", "serie": 4, "reps": 12, "charge": 64}, {"exerciceId": "ex24", "serie": 1, "reps": 15, "charge": 37}, {"exerciceId": "ex24", "serie": 2, "reps": 15, "charge": 37}, {"exerciceId": "ex24", "serie": 3, "reps": 12, "charge": 39}, {"exerciceId": "ex24", "serie": 4, "reps": 12, "charge": 39}, {"exerciceId": "ex25", "serie": 1, "reps": 15, "charge": 37}, {"exerciceId": "ex25", "serie": 2, "reps": 15, "charge": 37}, {"exerciceId": "ex25", "serie": 3, "reps": 12, "charge": 39}, {"exerciceId": "ex25", "serie": 4, "reps": 12, "charge": 39}, {"exerciceId": "ex27", "serie": 1, "reps": 15, "charge": 27}, {"exerciceId": "ex27", "serie": 2, "reps": 15, "charge": 27}, {"exerciceId": "ex27", "serie": 3, "reps": 12, "charge": 29}, {"exerciceId": "ex27", "serie": 4, "reps": 12, "charge": 29}, {"exerciceId": "ex28", "serie": 1, "reps": 15, "charge": 27}, {"exerciceId": "ex28", "serie": 2, "reps": 15, "charge": 27}, {"exerciceId": "ex28", "serie": 3, "reps": 12, "charge": 29}, {"exerciceId": "ex28", "serie": 4, "reps": 12, "charge": 29}, {"exerciceId": "ex29", "serie": 1, "reps": 15, "charge": 13}, {"exerciceId": "ex29", "serie": 2, "reps": 15, "charge": 13}, {"exerciceId": "ex29", "serie": 3, "reps": 12, "charge": 14}, {"exerciceId": "ex29", "serie": 4, "reps": 12, "charge": 14}, {"exerciceId": "ex30", "serie": 1, "reps": 15, "charge": 22}, {"exerciceId": "ex30", "serie": 2, "reps": 15, "charge": 22}, {"exerciceId": "ex30", "serie": 3, "reps": 12, "charge": 24}, {"exerciceId": "ex30", "serie": 4, "reps": 12, "charge": 24}, {"exerciceId": "ex31", "serie": 1, "reps": 15, "charge": 27}, {"exerciceId": "ex31", "serie": 2, "reps": 15, "charge": 27}, {"exerciceId": "ex31", "serie": 3, "reps": 12, "charge": 29}, {"exerciceId": "ex31", "serie": 4, "reps": 12, "charge": 29}, {"exerciceId": "ex33", "serie": 1, "reps": 15, "charge": 16}, {"exerciceId": "ex33", "serie": 2, "reps": 15, "charge": 16}, {"exerciceId": "ex33", "serie": 3, "reps": 12, "charge": 17}, {"exerciceId": "ex33", "serie": 4, "reps": 12, "charge": 17}, {"exerciceId": "ex34", "serie": 1, "reps": 15, "charge": 22}, {"exerciceId": "ex34", "serie": 2, "reps": 15, "charge": 22}, {"exerciceId": "ex34", "serie": 3, "reps": 12, "charge": 24}, {"exerciceId": "ex34", "serie": 4, "reps": 12, "charge": 24}, {"exerciceId": "ex36", "serie": 1, "reps": 15, "charge": 7}, {"exerciceId": "ex36", "serie": 2, "reps": 15, "charge": 7}, {"exerciceId": "ex36", "serie": 3, "reps": 12, "charge": 8}, {"exerciceId": "ex36", "serie": 4, "reps": 12, "charge": 8}, {"exerciceId": "ex42", "serie": 1, "reps": 33, "charge": 6}, {"exerciceId": "ex42", "serie": 2, "reps": 33, "charge": 6}, {"exerciceId": "ex42", "serie": 3, "reps": 28, "charge": 7}, {"exerciceId": "ex42", "serie": 4, "reps": 28, "charge": 7}, {"exerciceId": "ex43", "serie": 1, "reps": 33, "charge": 6}, {"exerciceId": "ex43", "serie": 2, "reps": 33, "charge": 6}, {"exerciceId": "ex43", "serie": 3, "reps": 28, "charge": 7}, {"exerciceId": "ex43", "serie": 4, "reps": 28, "charge": 7}, {"exerciceId": "ex44", "serie": 1, "reps": 33, "charge": 6}, {"exerciceId": "ex44", "serie": 2, "reps": 33, "charge": 6}, {"exerciceId": "ex44", "serie": 3, "reps": 28, "charge": 7}, {"exerciceId": "ex44", "serie": 4, "reps": 28, "charge": 7}, {"exerciceId": "ex45", "serie": 1, "reps": 15, "charge": 9}, {"exerciceId": "ex45", "serie": 2, "reps": 15, "charge": 9}, {"exerciceId": "ex45", "serie": 3, "reps": 12, "charge": 10}, {"exerciceId": "ex45", "serie": 4, "reps": 12, "charge": 10}, {"exerciceId": "ex46", "serie": 1, "reps": 15, "charge": 17}, {"exerciceId": "ex46", "serie": 2, "reps": 15, "charge": 17}, {"exerciceId": "ex46", "serie": 3, "reps": 12, "charge": 18}, {"exerciceId": "ex46", "serie": 4, "reps": 12, "charge": 18}, {"exerciceId": "ex47", "serie": 1, "reps": 15, "charge": 6}, {"exerciceId": "ex47", "serie": 2, "reps": 15, "charge": 6}, {"exerciceId": "ex47", "serie": 3, "reps": 12, "charge": 7}, {"exerciceId": "ex47", "serie": 4, "reps": 12, "charge": 7}, {"exerciceId": "ex48", "serie": 1, "reps": 15, "charge": 6}, {"exerciceId": "ex48", "serie": 2, "reps": 15, "charge": 6}, {"exerciceId": "ex48", "serie": 3, "reps": 12, "charge": 7}, {"exerciceId": "ex48", "serie": 4, "reps": 12, "charge": 7}]}, {"id": "se5", "date": "2026-08-03", "entries": [{"exerciceId": "ex1", "serie": 1, "reps": 13, "charge": 9}, {"exerciceId": "ex2", "serie": 1, "reps": 13, "charge": 22}, {"exerciceId": "ex3", "serie": 1, "reps": 13, "charge": 22}, {"exerciceId": "ex4", "serie": 1, "reps": 13, "charge": 11}, {"exerciceId": "ex5", "serie": 1, "reps": 16, "charge": 6}, {"exerciceId": "ex6", "serie": 1, "reps": 16, "charge": 9}, {"exerciceId": "ex7", "serie": 1, "reps": 13, "charge": 6}, {"exerciceId": "ex8", "serie": 1, "reps": 16, "charge": 44}, {"exerciceId": "ex8", "serie": 2, "reps": 16, "charge": 44}, {"exerciceId": "ex8", "serie": 3, "reps": 13, "charge": 46}, {"exerciceId": "ex8", "serie": 4, "reps": 13, "charge": 46}, {"exerciceId": "ex9", "serie": 1, "reps": 16, "charge": 64}, {"exerciceId": "ex9", "serie": 2, "reps": 16, "charge": 64}, {"exerciceId": "ex9", "serie": 3, "reps": 13, "charge": 66}, {"exerciceId": "ex9", "serie": 4, "reps": 13, "charge": 66}, {"exerciceId": "ex10", "serie": 1, "reps": 16, "charge": 49}, {"exerciceId": "ex10", "serie": 2, "reps": 16, "charge": 49}, {"exerciceId": "ex10", "serie": 3, "reps": 13, "charge": 51}, {"exerciceId": "ex10", "serie": 4, "reps": 13, "charge": 51}, {"exerciceId": "ex11", "serie": 1, "reps": 16, "charge": 34}, {"exerciceId": "ex11", "serie": 2, "reps": 16, "charge": 34}, {"exerciceId": "ex11", "serie": 3, "reps": 13, "charge": 36}, {"exerciceId": "ex11", "serie": 4, "reps": 13, "charge": 36}, {"exerciceId": "ex12", "serie": 1, "reps": 16, "charge": 54}, {"exerciceId": "ex12", "serie": 2, "reps": 16, "charge": 54}, {"exerciceId": "ex12", "serie": 3, "reps": 13, "charge": 56}, {"exerciceId": "ex12", "serie": 4, "reps": 13, "charge": 56}, {"exerciceId": "ex13", "serie": 1, "reps": 16, "charge": 34}, {"exerciceId": "ex13", "serie": 2, "reps": 16, "charge": 34}, {"exerciceId": "ex13", "serie": 3, "reps": 13, "charge": 36}, {"exerciceId": "ex13", "serie": 4, "reps": 13, "charge": 36}, {"exerciceId": "ex14", "serie": 1, "reps": 16, "charge": 39}, {"exerciceId": "ex14", "serie": 2, "reps": 16, "charge": 39}, {"exerciceId": "ex14", "serie": 3, "reps": 13, "charge": 41}, {"exerciceId": "ex14", "serie": 4, "reps": 13, "charge": 41}, {"exerciceId": "ex16", "serie": 1, "reps": 16, "charge": 39}, {"exerciceId": "ex16", "serie": 2, "reps": 16, "charge": 39}, {"exerciceId": "ex16", "serie": 3, "reps": 13, "charge": 41}, {"exerciceId": "ex16", "serie": 4, "reps": 13, "charge": 41}, {"exerciceId": "ex18", "serie": 1, "reps": 16, "charge": 24}, {"exerciceId": "ex18", "serie": 2, "reps": 16, "charge": 24}, {"exerciceId": "ex18", "serie": 3, "reps": 13, "charge": 26}, {"exerciceId": "ex18", "serie": 4, "reps": 13, "charge": 26}, {"exerciceId": "ex20", "serie": 1, "reps": 16, "charge": 29}, {"exerciceId": "ex20", "serie": 2, "reps": 16, "charge": 29}, {"exerciceId": "ex20", "serie": 3, "reps": 13, "charge": 31}, {"exerciceId": "ex20", "serie": 4, "reps": 13, "charge": 31}, {"exerciceId": "ex21", "serie": 1, "reps": 16, "charge": 34}, {"exerciceId": "ex21", "serie": 2, "reps": 16, "charge": 34}, {"exerciceId": "ex21", "serie": 3, "reps": 13, "charge": 36}, {"exerciceId": "ex21", "serie": 4, "reps": 13, "charge": 36}, {"exerciceId": "ex23", "serie": 1, "reps": 16, "charge": 64}, {"exerciceId": "ex23", "serie": 2, "reps": 16, "charge": 64}, {"exerciceId": "ex23", "serie": 3, "reps": 13, "charge": 66}, {"exerciceId": "ex23", "serie": 4, "reps": 13, "charge": 66}, {"exerciceId": "ex24", "serie": 1, "reps": 16, "charge": 39}, {"exerciceId": "ex24", "serie": 2, "reps": 16, "charge": 39}, {"exerciceId": "ex24", "serie": 3, "reps": 13, "charge": 41}, {"exerciceId": "ex24", "serie": 4, "reps": 13, "charge": 41}, {"exerciceId": "ex25", "serie": 1, "reps": 16, "charge": 39}, {"exerciceId": "ex25", "serie": 2, "reps": 16, "charge": 39}, {"exerciceId": "ex25", "serie": 3, "reps": 13, "charge": 41}, {"exerciceId": "ex25", "serie": 4, "reps": 13, "charge": 41}, {"exerciceId": "ex27", "serie": 1, "reps": 16, "charge": 29}, {"exerciceId": "ex27", "serie": 2, "reps": 16, "charge": 29}, {"exerciceId": "ex27", "serie": 3, "reps": 13, "charge": 31}, {"exerciceId": "ex27", "serie": 4, "reps": 13, "charge": 31}, {"exerciceId": "ex28", "serie": 1, "reps": 16, "charge": 29}, {"exerciceId": "ex28", "serie": 2, "reps": 16, "charge": 29}, {"exerciceId": "ex28", "serie": 3, "reps": 13, "charge": 31}, {"exerciceId": "ex28", "serie": 4, "reps": 13, "charge": 31}, {"exerciceId": "ex29", "serie": 1, "reps": 16, "charge": 14}, {"exerciceId": "ex29", "serie": 2, "reps": 16, "charge": 14}, {"exerciceId": "ex29", "serie": 3, "reps": 13, "charge": 15}, {"exerciceId": "ex29", "serie": 4, "reps": 13, "charge": 15}, {"exerciceId": "ex30", "serie": 1, "reps": 16, "charge": 24}, {"exerciceId": "ex30", "serie": 2, "reps": 16, "charge": 24}, {"exerciceId": "ex30", "serie": 3, "reps": 13, "charge": 26}, {"exerciceId": "ex30", "serie": 4, "reps": 13, "charge": 26}, {"exerciceId": "ex31", "serie": 1, "reps": 16, "charge": 29}, {"exerciceId": "ex31", "serie": 2, "reps": 16, "charge": 29}, {"exerciceId": "ex31", "serie": 3, "reps": 13, "charge": 31}, {"exerciceId": "ex31", "serie": 4, "reps": 13, "charge": 31}, {"exerciceId": "ex33", "serie": 1, "reps": 16, "charge": 17}, {"exerciceId": "ex33", "serie": 2, "reps": 16, "charge": 17}, {"exerciceId": "ex33", "serie": 3, "reps": 13, "charge": 18}, {"exerciceId": "ex33", "serie": 4, "reps": 13, "charge": 18}, {"exerciceId": "ex34", "serie": 1, "reps": 16, "charge": 24}, {"exerciceId": "ex34", "serie": 2, "reps": 16, "charge": 24}, {"exerciceId": "ex34", "serie": 3, "reps": 13, "charge": 26}, {"exerciceId": "ex34", "serie": 4, "reps": 13, "charge": 26}, {"exerciceId": "ex36", "serie": 1, "reps": 16, "charge": 8}, {"exerciceId": "ex36", "serie": 2, "reps": 16, "charge": 8}, {"exerciceId": "ex36", "serie": 3, "reps": 13, "charge": 9}, {"exerciceId": "ex36", "serie": 4, "reps": 13, "charge": 9}, {"exerciceId": "ex42", "serie": 1, "reps": 36, "charge": 7}, {"exerciceId": "ex42", "serie": 2, "reps": 36, "charge": 7}, {"exerciceId": "ex42", "serie": 3, "reps": 31, "charge": 8}, {"exerciceId": "ex42", "serie": 4, "reps": 31, "charge": 8}, {"exerciceId": "ex43", "serie": 1, "reps": 36, "charge": 7}, {"exerciceId": "ex43", "serie": 2, "reps": 36, "charge": 7}, {"exerciceId": "ex43", "serie": 3, "reps": 31, "charge": 8}, {"exerciceId": "ex43", "serie": 4, "reps": 31, "charge": 8}, {"exerciceId": "ex44", "serie": 1, "reps": 36, "charge": 7}, {"exerciceId": "ex44", "serie": 2, "reps": 36, "charge": 7}, {"exerciceId": "ex44", "serie": 3, "reps": 31, "charge": 8}, {"exerciceId": "ex44", "serie": 4, "reps": 31, "charge": 8}, {"exerciceId": "ex45", "serie": 1, "reps": 16, "charge": 10}, {"exerciceId": "ex45", "serie": 2, "reps": 16, "charge": 10}, {"exerciceId": "ex45", "serie": 3, "reps": 13, "charge": 11}, {"exerciceId": "ex45", "serie": 4, "reps": 13, "charge": 11}, {"exerciceId": "ex46", "serie": 1, "reps": 16, "charge": 18}, {"exerciceId": "ex46", "serie": 2, "reps": 16, "charge": 18}, {"exerciceId": "ex46", "serie": 3, "reps": 13, "charge": 19}, {"exerciceId": "ex46", "serie": 4, "reps": 13, "charge": 19}, {"exerciceId": "ex47", "serie": 1, "reps": 16, "charge": 7}, {"exerciceId": "ex47", "serie": 2, "reps": 16, "charge": 7}, {"exerciceId": "ex47", "serie": 3, "reps": 13, "charge": 8}, {"exerciceId": "ex47", "serie": 4, "reps": 13, "charge": 8}, {"exerciceId": "ex48", "serie": 1, "reps": 16, "charge": 7}, {"exerciceId": "ex48", "serie": 2, "reps": 16, "charge": 7}, {"exerciceId": "ex48", "serie": 3, "reps": 13, "charge": 8}, {"exerciceId": "ex48", "serie": 4, "reps": 13, "charge": 8}]}, {"id": "se6", "date": "2026-08-06", "entries": [{"exerciceId": "ex1", "serie": 1, "reps": 13, "charge": 9}, {"exerciceId": "ex2", "serie": 1, "reps": 13, "charge": 22}, {"exerciceId": "ex3", "serie": 1, "reps": 13, "charge": 22}, {"exerciceId": "ex4", "serie": 1, "reps": 13, "charge": 11}, {"exerciceId": "ex5", "serie": 1, "reps": 16, "charge": 6}, {"exerciceId": "ex6", "serie": 1, "reps": 16, "charge": 9}, {"exerciceId": "ex7", "serie": 1, "reps": 13, "charge": 6}, {"exerciceId": "ex8", "serie": 1, "reps": 16, "charge": 44}, {"exerciceId": "ex8", "serie": 2, "reps": 16, "charge": 44}, {"exerciceId": "ex8", "serie": 3, "reps": 13, "charge": 46}, {"exerciceId": "ex8", "serie": 4, "reps": 13, "charge": 46}, {"exerciceId": "ex9", "serie": 1, "reps": 16, "charge": 64}, {"exerciceId": "ex9", "serie": 2, "reps": 16, "charge": 64}, {"exerciceId": "ex9", "serie": 3, "reps": 13, "charge": 66}, {"exerciceId": "ex9", "serie": 4, "reps": 13, "charge": 66}, {"exerciceId": "ex10", "serie": 1, "reps": 16, "charge": 49}, {"exerciceId": "ex10", "serie": 2, "reps": 16, "charge": 49}, {"exerciceId": "ex10", "serie": 3, "reps": 13, "charge": 51}, {"exerciceId": "ex10", "serie": 4, "reps": 13, "charge": 51}, {"exerciceId": "ex11", "serie": 1, "reps": 16, "charge": 34}, {"exerciceId": "ex11", "serie": 2, "reps": 16, "charge": 34}, {"exerciceId": "ex11", "serie": 3, "reps": 13, "charge": 36}, {"exerciceId": "ex11", "serie": 4, "reps": 13, "charge": 36}, {"exerciceId": "ex12", "serie": 1, "reps": 16, "charge": 54}, {"exerciceId": "ex12", "serie": 2, "reps": 16, "charge": 54}, {"exerciceId": "ex12", "serie": 3, "reps": 13, "charge": 56}, {"exerciceId": "ex12", "serie": 4, "reps": 13, "charge": 56}, {"exerciceId": "ex13", "serie": 1, "reps": 16, "charge": 34}, {"exerciceId": "ex13", "serie": 2, "reps": 16, "charge": 34}, {"exerciceId": "ex13", "serie": 3, "reps": 13, "charge": 36}, {"exerciceId": "ex13", "serie": 4, "reps": 13, "charge": 36}, {"exerciceId": "ex14", "serie": 1, "reps": 16, "charge": 39}, {"exerciceId": "ex14", "serie": 2, "reps": 16, "charge": 39}, {"exerciceId": "ex14", "serie": 3, "reps": 13, "charge": 41}, {"exerciceId": "ex14", "serie": 4, "reps": 13, "charge": 41}, {"exerciceId": "ex16", "serie": 1, "reps": 16, "charge": 39}, {"exerciceId": "ex16", "serie": 2, "reps": 16, "charge": 39}, {"exerciceId": "ex16", "serie": 3, "reps": 13, "charge": 41}, {"exerciceId": "ex16", "serie": 4, "reps": 13, "charge": 41}, {"exerciceId": "ex18", "serie": 1, "reps": 16, "charge": 24}, {"exerciceId": "ex18", "serie": 2, "reps": 16, "charge": 24}, {"exerciceId": "ex18", "serie": 3, "reps": 13, "charge": 26}, {"exerciceId": "ex18", "serie": 4, "reps": 13, "charge": 26}, {"exerciceId": "ex20", "serie": 1, "reps": 16, "charge": 29}, {"exerciceId": "ex20", "serie": 2, "reps": 16, "charge": 29}, {"exerciceId": "ex20", "serie": 3, "reps": 13, "charge": 31}, {"exerciceId": "ex20", "serie": 4, "reps": 13, "charge": 31}, {"exerciceId": "ex21", "serie": 1, "reps": 16, "charge": 34}, {"exerciceId": "ex21", "serie": 2, "reps": 16, "charge": 34}, {"exerciceId": "ex21", "serie": 3, "reps": 13, "charge": 36}, {"exerciceId": "ex21", "serie": 4, "reps": 13, "charge": 36}, {"exerciceId": "ex23", "serie": 1, "reps": 16, "charge": 64}, {"exerciceId": "ex23", "serie": 2, "reps": 16, "charge": 64}, {"exerciceId": "ex23", "serie": 3, "reps": 13, "charge": 66}, {"exerciceId": "ex23", "serie": 4, "reps": 13, "charge": 66}, {"exerciceId": "ex24", "serie": 1, "reps": 16, "charge": 39}, {"exerciceId": "ex24", "serie": 2, "reps": 16, "charge": 39}, {"exerciceId": "ex24", "serie": 3, "reps": 13, "charge": 41}, {"exerciceId": "ex24", "serie": 4, "reps": 13, "charge": 41}, {"exerciceId": "ex25", "serie": 1, "reps": 16, "charge": 39}, {"exerciceId": "ex25", "serie": 2, "reps": 16, "charge": 39}, {"exerciceId": "ex25", "serie": 3, "reps": 13, "charge": 41}, {"exerciceId": "ex25", "serie": 4, "reps": 13, "charge": 41}, {"exerciceId": "ex27", "serie": 1, "reps": 16, "charge": 29}, {"exerciceId": "ex27", "serie": 2, "reps": 16, "charge": 29}, {"exerciceId": "ex27", "serie": 3, "reps": 13, "charge": 31}, {"exerciceId": "ex27", "serie": 4, "reps": 13, "charge": 31}, {"exerciceId": "ex28", "serie": 1, "reps": 16, "charge": 29}, {"exerciceId": "ex28", "serie": 2, "reps": 16, "charge": 29}, {"exerciceId": "ex28", "serie": 3, "reps": 13, "charge": 31}, {"exerciceId": "ex28", "serie": 4, "reps": 13, "charge": 31}, {"exerciceId": "ex29", "serie": 1, "reps": 16, "charge": 14}, {"exerciceId": "ex29", "serie": 2, "reps": 16, "charge": 14}, {"exerciceId": "ex29", "serie": 3, "reps": 13, "charge": 15}, {"exerciceId": "ex29", "serie": 4, "reps": 13, "charge": 15}, {"exerciceId": "ex30", "serie": 1, "reps": 16, "charge": 24}, {"exerciceId": "ex30", "serie": 2, "reps": 16, "charge": 24}, {"exerciceId": "ex30", "serie": 3, "reps": 13, "charge": 26}, {"exerciceId": "ex30", "serie": 4, "reps": 13, "charge": 26}, {"exerciceId": "ex31", "serie": 1, "reps": 16, "charge": 29}, {"exerciceId": "ex31", "serie": 2, "reps": 16, "charge": 29}, {"exerciceId": "ex31", "serie": 3, "reps": 13, "charge": 31}, {"exerciceId": "ex31", "serie": 4, "reps": 13, "charge": 31}, {"exerciceId": "ex33", "serie": 1, "reps": 16, "charge": 17}, {"exerciceId": "ex33", "serie": 2, "reps": 16, "charge": 17}, {"exerciceId": "ex33", "serie": 3, "reps": 13, "charge": 18}, {"exerciceId": "ex33", "serie": 4, "reps": 13, "charge": 18}, {"exerciceId": "ex34", "serie": 1, "reps": 16, "charge": 24}, {"exerciceId": "ex34", "serie": 2, "reps": 16, "charge": 24}, {"exerciceId": "ex34", "serie": 3, "reps": 13, "charge": 26}, {"exerciceId": "ex34", "serie": 4, "reps": 13, "charge": 26}, {"exerciceId": "ex36", "serie": 1, "reps": 16, "charge": 8}, {"exerciceId": "ex36", "serie": 2, "reps": 16, "charge": 8}, {"exerciceId": "ex36", "serie": 3, "reps": 13, "charge": 9}, {"exerciceId": "ex36", "serie": 4, "reps": 13, "charge": 9}, {"exerciceId": "ex42", "serie": 1, "reps": 36, "charge": 7}, {"exerciceId": "ex42", "serie": 2, "reps": 36, "charge": 7}, {"exerciceId": "ex42", "serie": 3, "reps": 31, "charge": 8}, {"exerciceId": "ex42", "serie": 4, "reps": 31, "charge": 8}, {"exerciceId": "ex43", "serie": 1, "reps": 36, "charge": 7}, {"exerciceId": "ex43", "serie": 2, "reps": 36, "charge": 7}, {"exerciceId": "ex43", "serie": 3, "reps": 31, "charge": 8}, {"exerciceId": "ex43", "serie": 4, "reps": 31, "charge": 8}, {"exerciceId": "ex44", "serie": 1, "reps": 36, "charge": 7}, {"exerciceId": "ex44", "serie": 2, "reps": 36, "charge": 7}, {"exerciceId": "ex44", "serie": 3, "reps": 31, "charge": 8}, {"exerciceId": "ex44", "serie": 4, "reps": 31, "charge": 8}, {"exerciceId": "ex45", "serie": 1, "reps": 16, "charge": 10}, {"exerciceId": "ex45", "serie": 2, "reps": 16, "charge": 10}, {"exerciceId": "ex45", "serie": 3, "reps": 13, "charge": 11}, {"exerciceId": "ex45", "serie": 4, "reps": 13, "charge": 11}, {"exerciceId": "ex46", "serie": 1, "reps": 16, "charge": 18}, {"exerciceId": "ex46", "serie": 2, "reps": 16, "charge": 18}, {"exerciceId": "ex46", "serie": 3, "reps": 13, "charge": 19}, {"exerciceId": "ex46", "serie": 4, "reps": 13, "charge": 19}, {"exerciceId": "ex47", "serie": 1, "reps": 16, "charge": 7}, {"exerciceId": "ex47", "serie": 2, "reps": 16, "charge": 7}, {"exerciceId": "ex47", "serie": 3, "reps": 13, "charge": 8}, {"exerciceId": "ex47", "serie": 4, "reps": 13, "charge": 8}, {"exerciceId": "ex48", "serie": 1, "reps": 16, "charge": 7}, {"exerciceId": "ex48", "serie": 2, "reps": 16, "charge": 7}, {"exerciceId": "ex48", "serie": 3, "reps": 13, "charge": 8}, {"exerciceId": "ex48", "serie": 4, "reps": 13, "charge": 8}]}, {"id": "se7", "date": "2026-08-10", "entries": [{"exerciceId": "ex1", "serie": 1, "reps": 13, "charge": 10}, {"exerciceId": "ex2", "serie": 1, "reps": 13, "charge": 24}, {"exerciceId": "ex3", "serie": 1, "reps": 13, "charge": 24}, {"exerciceId": "ex4", "serie": 1, "reps": 13, "charge": 12}, {"exerciceId": "ex5", "serie": 1, "reps": 16, "charge": 7}, {"exerciceId": "ex6", "serie": 1, "reps": 16, "charge": 10}, {"exerciceId": "ex7", "serie": 1, "reps": 13, "charge": 7}, {"exerciceId": "ex8", "serie": 1, "reps": 16, "charge": 46}, {"exerciceId": "ex8", "serie": 2, "reps": 16, "charge": 46}, {"exerciceId": "ex8", "serie": 3, "reps": 13, "charge": 48}, {"exerciceId": "ex8", "serie": 4, "reps": 13, "charge": 48}, {"exerciceId": "ex9", "serie": 1, "reps": 16, "charge": 66}, {"exerciceId": "ex9", "serie": 2, "reps": 16, "charge": 66}, {"exerciceId": "ex9", "serie": 3, "reps": 13, "charge": 68}, {"exerciceId": "ex9", "serie": 4, "reps": 13, "charge": 68}, {"exerciceId": "ex10", "serie": 1, "reps": 16, "charge": 51}, {"exerciceId": "ex10", "serie": 2, "reps": 16, "charge": 51}, {"exerciceId": "ex10", "serie": 3, "reps": 13, "charge": 53}, {"exerciceId": "ex10", "serie": 4, "reps": 13, "charge": 53}, {"exerciceId": "ex11", "serie": 1, "reps": 16, "charge": 36}, {"exerciceId": "ex11", "serie": 2, "reps": 16, "charge": 36}, {"exerciceId": "ex11", "serie": 3, "reps": 13, "charge": 38}, {"exerciceId": "ex11", "serie": 4, "reps": 13, "charge": 38}, {"exerciceId": "ex12", "serie": 1, "reps": 16, "charge": 56}, {"exerciceId": "ex12", "serie": 2, "reps": 16, "charge": 56}, {"exerciceId": "ex12", "serie": 3, "reps": 13, "charge": 58}, {"exerciceId": "ex12", "serie": 4, "reps": 13, "charge": 58}, {"exerciceId": "ex13", "serie": 1, "reps": 16, "charge": 36}, {"exerciceId": "ex13", "serie": 2, "reps": 16, "charge": 36}, {"exerciceId": "ex13", "serie": 3, "reps": 13, "charge": 38}, {"exerciceId": "ex13", "serie": 4, "reps": 13, "charge": 38}, {"exerciceId": "ex14", "serie": 1, "reps": 16, "charge": 41}, {"exerciceId": "ex14", "serie": 2, "reps": 16, "charge": 41}, {"exerciceId": "ex14", "serie": 3, "reps": 13, "charge": 43}, {"exerciceId": "ex14", "serie": 4, "reps": 13, "charge": 43}, {"exerciceId": "ex16", "serie": 1, "reps": 16, "charge": 41}, {"exerciceId": "ex16", "serie": 2, "reps": 16, "charge": 41}, {"exerciceId": "ex16", "serie": 3, "reps": 13, "charge": 43}, {"exerciceId": "ex16", "serie": 4, "reps": 13, "charge": 43}, {"exerciceId": "ex18", "serie": 1, "reps": 16, "charge": 26}, {"exerciceId": "ex18", "serie": 2, "reps": 16, "charge": 26}, {"exerciceId": "ex18", "serie": 3, "reps": 13, "charge": 28}, {"exerciceId": "ex18", "serie": 4, "reps": 13, "charge": 28}, {"exerciceId": "ex20", "serie": 1, "reps": 16, "charge": 31}, {"exerciceId": "ex20", "serie": 2, "reps": 16, "charge": 31}, {"exerciceId": "ex20", "serie": 3, "reps": 13, "charge": 33}, {"exerciceId": "ex20", "serie": 4, "reps": 13, "charge": 33}, {"exerciceId": "ex21", "serie": 1, "reps": 16, "charge": 36}, {"exerciceId": "ex21", "serie": 2, "reps": 16, "charge": 36}, {"exerciceId": "ex21", "serie": 3, "reps": 13, "charge": 38}, {"exerciceId": "ex21", "serie": 4, "reps": 13, "charge": 38}, {"exerciceId": "ex23", "serie": 1, "reps": 16, "charge": 66}, {"exerciceId": "ex23", "serie": 2, "reps": 16, "charge": 66}, {"exerciceId": "ex23", "serie": 3, "reps": 13, "charge": 68}, {"exerciceId": "ex23", "serie": 4, "reps": 13, "charge": 68}, {"exerciceId": "ex24", "serie": 1, "reps": 16, "charge": 41}, {"exerciceId": "ex24", "serie": 2, "reps": 16, "charge": 41}, {"exerciceId": "ex24", "serie": 3, "reps": 13, "charge": 43}, {"exerciceId": "ex24", "serie": 4, "reps": 13, "charge": 43}, {"exerciceId": "ex25", "serie": 1, "reps": 16, "charge": 41}, {"exerciceId": "ex25", "serie": 2, "reps": 16, "charge": 41}, {"exerciceId": "ex25", "serie": 3, "reps": 13, "charge": 43}, {"exerciceId": "ex25", "serie": 4, "reps": 13, "charge": 43}, {"exerciceId": "ex27", "serie": 1, "reps": 16, "charge": 31}, {"exerciceId": "ex27", "serie": 2, "reps": 16, "charge": 31}, {"exerciceId": "ex27", "serie": 3, "reps": 13, "charge": 33}, {"exerciceId": "ex27", "serie": 4, "reps": 13, "charge": 33}, {"exerciceId": "ex28", "serie": 1, "reps": 16, "charge": 31}, {"exerciceId": "ex28", "serie": 2, "reps": 16, "charge": 31}, {"exerciceId": "ex28", "serie": 3, "reps": 13, "charge": 33}, {"exerciceId": "ex28", "serie": 4, "reps": 13, "charge": 33}, {"exerciceId": "ex29", "serie": 1, "reps": 16, "charge": 15}, {"exerciceId": "ex29", "serie": 2, "reps": 16, "charge": 15}, {"exerciceId": "ex29", "serie": 3, "reps": 13, "charge": 16}, {"exerciceId": "ex29", "serie": 4, "reps": 13, "charge": 16}, {"exerciceId": "ex30", "serie": 1, "reps": 16, "charge": 26}, {"exerciceId": "ex30", "serie": 2, "reps": 16, "charge": 26}, {"exerciceId": "ex30", "serie": 3, "reps": 13, "charge": 28}, {"exerciceId": "ex30", "serie": 4, "reps": 13, "charge": 28}, {"exerciceId": "ex31", "serie": 1, "reps": 16, "charge": 31}, {"exerciceId": "ex31", "serie": 2, "reps": 16, "charge": 31}, {"exerciceId": "ex31", "serie": 3, "reps": 13, "charge": 33}, {"exerciceId": "ex31", "serie": 4, "reps": 13, "charge": 33}, {"exerciceId": "ex33", "serie": 1, "reps": 16, "charge": 18}, {"exerciceId": "ex33", "serie": 2, "reps": 16, "charge": 18}, {"exerciceId": "ex33", "serie": 3, "reps": 13, "charge": 19}, {"exerciceId": "ex33", "serie": 4, "reps": 13, "charge": 19}, {"exerciceId": "ex34", "serie": 1, "reps": 16, "charge": 26}, {"exerciceId": "ex34", "serie": 2, "reps": 16, "charge": 26}, {"exerciceId": "ex34", "serie": 3, "reps": 13, "charge": 28}, {"exerciceId": "ex34", "serie": 4, "reps": 13, "charge": 28}, {"exerciceId": "ex36", "serie": 1, "reps": 16, "charge": 9}, {"exerciceId": "ex36", "serie": 2, "reps": 16, "charge": 9}, {"exerciceId": "ex36", "serie": 3, "reps": 13, "charge": 10}, {"exerciceId": "ex36", "serie": 4, "reps": 13, "charge": 10}, {"exerciceId": "ex42", "serie": 1, "reps": 39, "charge": 8}, {"exerciceId": "ex42", "serie": 2, "reps": 39, "charge": 8}, {"exerciceId": "ex42", "serie": 3, "reps": 34, "charge": 9}, {"exerciceId": "ex42", "serie": 4, "reps": 34, "charge": 9}, {"exerciceId": "ex43", "serie": 1, "reps": 39, "charge": 8}, {"exerciceId": "ex43", "serie": 2, "reps": 39, "charge": 8}, {"exerciceId": "ex43", "serie": 3, "reps": 34, "charge": 9}, {"exerciceId": "ex43", "serie": 4, "reps": 34, "charge": 9}, {"exerciceId": "ex44", "serie": 1, "reps": 39, "charge": 8}, {"exerciceId": "ex44", "serie": 2, "reps": 39, "charge": 8}, {"exerciceId": "ex44", "serie": 3, "reps": 34, "charge": 9}, {"exerciceId": "ex44", "serie": 4, "reps": 34, "charge": 9}, {"exerciceId": "ex45", "serie": 1, "reps": 16, "charge": 11}, {"exerciceId": "ex45", "serie": 2, "reps": 16, "charge": 11}, {"exerciceId": "ex45", "serie": 3, "reps": 13, "charge": 12}, {"exerciceId": "ex45", "serie": 4, "reps": 13, "charge": 12}, {"exerciceId": "ex46", "serie": 1, "reps": 16, "charge": 19}, {"exerciceId": "ex46", "serie": 2, "reps": 16, "charge": 19}, {"exerciceId": "ex46", "serie": 3, "reps": 13, "charge": 20}, {"exerciceId": "ex46", "serie": 4, "reps": 13, "charge": 20}, {"exerciceId": "ex47", "serie": 1, "reps": 16, "charge": 8}, {"exerciceId": "ex47", "serie": 2, "reps": 16, "charge": 8}, {"exerciceId": "ex47", "serie": 3, "reps": 13, "charge": 9}, {"exerciceId": "ex47", "serie": 4, "reps": 13, "charge": 9}, {"exerciceId": "ex48", "serie": 1, "reps": 16, "charge": 8}, {"exerciceId": "ex48", "serie": 2, "reps": 16, "charge": 8}, {"exerciceId": "ex48", "serie": 3, "reps": 13, "charge": 9}, {"exerciceId": "ex48", "serie": 4, "reps": 13, "charge": 9}]}, {"id": "se8", "date": "2026-08-13", "entries": [{"exerciceId": "ex1", "serie": 1, "reps": 13, "charge": 10}, {"exerciceId": "ex2", "serie": 1, "reps": 13, "charge": 24}, {"exerciceId": "ex3", "serie": 1, "reps": 13, "charge": 24}, {"exerciceId": "ex4", "serie": 1, "reps": 13, "charge": 12}, {"exerciceId": "ex5", "serie": 1, "reps": 16, "charge": 7}, {"exerciceId": "ex6", "serie": 1, "reps": 16, "charge": 10}, {"exerciceId": "ex7", "serie": 1, "reps": 13, "charge": 7}, {"exerciceId": "ex8", "serie": 1, "reps": 16, "charge": 46}, {"exerciceId": "ex8", "serie": 2, "reps": 16, "charge": 46}, {"exerciceId": "ex8", "serie": 3, "reps": 13, "charge": 48}, {"exerciceId": "ex8", "serie": 4, "reps": 13, "charge": 48}, {"exerciceId": "ex9", "serie": 1, "reps": 16, "charge": 66}, {"exerciceId": "ex9", "serie": 2, "reps": 16, "charge": 66}, {"exerciceId": "ex9", "serie": 3, "reps": 13, "charge": 68}, {"exerciceId": "ex9", "serie": 4, "reps": 13, "charge": 68}, {"exerciceId": "ex10", "serie": 1, "reps": 16, "charge": 51}, {"exerciceId": "ex10", "serie": 2, "reps": 16, "charge": 51}, {"exerciceId": "ex10", "serie": 3, "reps": 13, "charge": 53}, {"exerciceId": "ex10", "serie": 4, "reps": 13, "charge": 53}, {"exerciceId": "ex11", "serie": 1, "reps": 16, "charge": 36}, {"exerciceId": "ex11", "serie": 2, "reps": 16, "charge": 36}, {"exerciceId": "ex11", "serie": 3, "reps": 13, "charge": 38}, {"exerciceId": "ex11", "serie": 4, "reps": 13, "charge": 38}, {"exerciceId": "ex12", "serie": 1, "reps": 16, "charge": 56}, {"exerciceId": "ex12", "serie": 2, "reps": 16, "charge": 56}, {"exerciceId": "ex12", "serie": 3, "reps": 13, "charge": 58}, {"exerciceId": "ex12", "serie": 4, "reps": 13, "charge": 58}, {"exerciceId": "ex13", "serie": 1, "reps": 16, "charge": 36}, {"exerciceId": "ex13", "serie": 2, "reps": 16, "charge": 36}, {"exerciceId": "ex13", "serie": 3, "reps": 13, "charge": 38}, {"exerciceId": "ex13", "serie": 4, "reps": 13, "charge": 38}, {"exerciceId": "ex14", "serie": 1, "reps": 16, "charge": 41}, {"exerciceId": "ex14", "serie": 2, "reps": 16, "charge": 41}, {"exerciceId": "ex14", "serie": 3, "reps": 13, "charge": 43}, {"exerciceId": "ex14", "serie": 4, "reps": 13, "charge": 43}, {"exerciceId": "ex16", "serie": 1, "reps": 16, "charge": 41}, {"exerciceId": "ex16", "serie": 2, "reps": 16, "charge": 41}, {"exerciceId": "ex16", "serie": 3, "reps": 13, "charge": 43}, {"exerciceId": "ex16", "serie": 4, "reps": 13, "charge": 43}, {"exerciceId": "ex18", "serie": 1, "reps": 16, "charge": 26}, {"exerciceId": "ex18", "serie": 2, "reps": 16, "charge": 26}, {"exerciceId": "ex18", "serie": 3, "reps": 13, "charge": 28}, {"exerciceId": "ex18", "serie": 4, "reps": 13, "charge": 28}, {"exerciceId": "ex20", "serie": 1, "reps": 16, "charge": 31}, {"exerciceId": "ex20", "serie": 2, "reps": 16, "charge": 31}, {"exerciceId": "ex20", "serie": 3, "reps": 13, "charge": 33}, {"exerciceId": "ex20", "serie": 4, "reps": 13, "charge": 33}, {"exerciceId": "ex21", "serie": 1, "reps": 16, "charge": 36}, {"exerciceId": "ex21", "serie": 2, "reps": 16, "charge": 36}, {"exerciceId": "ex21", "serie": 3, "reps": 13, "charge": 38}, {"exerciceId": "ex21", "serie": 4, "reps": 13, "charge": 38}, {"exerciceId": "ex23", "serie": 1, "reps": 16, "charge": 66}, {"exerciceId": "ex23", "serie": 2, "reps": 16, "charge": 66}, {"exerciceId": "ex23", "serie": 3, "reps": 13, "charge": 68}, {"exerciceId": "ex23", "serie": 4, "reps": 13, "charge": 68}, {"exerciceId": "ex24", "serie": 1, "reps": 16, "charge": 41}, {"exerciceId": "ex24", "serie": 2, "reps": 16, "charge": 41}, {"exerciceId": "ex24", "serie": 3, "reps": 13, "charge": 43}, {"exerciceId": "ex24", "serie": 4, "reps": 13, "charge": 43}, {"exerciceId": "ex25", "serie": 1, "reps": 16, "charge": 41}, {"exerciceId": "ex25", "serie": 2, "reps": 16, "charge": 41}, {"exerciceId": "ex25", "serie": 3, "reps": 13, "charge": 43}, {"exerciceId": "ex25", "serie": 4, "reps": 13, "charge": 43}, {"exerciceId": "ex27", "serie": 1, "reps": 16, "charge": 31}, {"exerciceId": "ex27", "serie": 2, "reps": 16, "charge": 31}, {"exerciceId": "ex27", "serie": 3, "reps": 13, "charge": 33}, {"exerciceId": "ex27", "serie": 4, "reps": 13, "charge": 33}, {"exerciceId": "ex28", "serie": 1, "reps": 16, "charge": 31}, {"exerciceId": "ex28", "serie": 2, "reps": 16, "charge": 31}, {"exerciceId": "ex28", "serie": 3, "reps": 13, "charge": 33}, {"exerciceId": "ex28", "serie": 4, "reps": 13, "charge": 33}, {"exerciceId": "ex29", "serie": 1, "reps": 16, "charge": 15}, {"exerciceId": "ex29", "serie": 2, "reps": 16, "charge": 15}, {"exerciceId": "ex29", "serie": 3, "reps": 13, "charge": 16}, {"exerciceId": "ex29", "serie": 4, "reps": 13, "charge": 16}, {"exerciceId": "ex30", "serie": 1, "reps": 16, "charge": 26}, {"exerciceId": "ex30", "serie": 2, "reps": 16, "charge": 26}, {"exerciceId": "ex30", "serie": 3, "reps": 13, "charge": 28}, {"exerciceId": "ex30", "serie": 4, "reps": 13, "charge": 28}, {"exerciceId": "ex31", "serie": 1, "reps": 16, "charge": 31}, {"exerciceId": "ex31", "serie": 2, "reps": 16, "charge": 31}, {"exerciceId": "ex31", "serie": 3, "reps": 13, "charge": 33}, {"exerciceId": "ex31", "serie": 4, "reps": 13, "charge": 33}, {"exerciceId": "ex33", "serie": 1, "reps": 16, "charge": 18}, {"exerciceId": "ex33", "serie": 2, "reps": 16, "charge": 18}, {"exerciceId": "ex33", "serie": 3, "reps": 13, "charge": 19}, {"exerciceId": "ex33", "serie": 4, "reps": 13, "charge": 19}, {"exerciceId": "ex34", "serie": 1, "reps": 16, "charge": 26}, {"exerciceId": "ex34", "serie": 2, "reps": 16, "charge": 26}, {"exerciceId": "ex34", "serie": 3, "reps": 13, "charge": 28}, {"exerciceId": "ex34", "serie": 4, "reps": 13, "charge": 28}, {"exerciceId": "ex36", "serie": 1, "reps": 16, "charge": 9}, {"exerciceId": "ex36", "serie": 2, "reps": 16, "charge": 9}, {"exerciceId": "ex36", "serie": 3, "reps": 13, "charge": 10}, {"exerciceId": "ex36", "serie": 4, "reps": 13, "charge": 10}, {"exerciceId": "ex42", "serie": 1, "reps": 39, "charge": 8}, {"exerciceId": "ex42", "serie": 2, "reps": 39, "charge": 8}, {"exerciceId": "ex42", "serie": 3, "reps": 34, "charge": 9}, {"exerciceId": "ex42", "serie": 4, "reps": 34, "charge": 9}, {"exerciceId": "ex43", "serie": 1, "reps": 39, "charge": 8}, {"exerciceId": "ex43", "serie": 2, "reps": 39, "charge": 8}, {"exerciceId": "ex43", "serie": 3, "reps": 34, "charge": 9}, {"exerciceId": "ex43", "serie": 4, "reps": 34, "charge": 9}, {"exerciceId": "ex44", "serie": 1, "reps": 39, "charge": 8}, {"exerciceId": "ex44", "serie": 2, "reps": 39, "charge": 8}, {"exerciceId": "ex44", "serie": 3, "reps": 34, "charge": 9}, {"exerciceId": "ex44", "serie": 4, "reps": 34, "charge": 9}, {"exerciceId": "ex45", "serie": 1, "reps": 16, "charge": 11}, {"exerciceId": "ex45", "serie": 2, "reps": 16, "charge": 11}, {"exerciceId": "ex45", "serie": 3, "reps": 13, "charge": 12}, {"exerciceId": "ex45", "serie": 4, "reps": 13, "charge": 12}, {"exerciceId": "ex46", "serie": 1, "reps": 16, "charge": 19}, {"exerciceId": "ex46", "serie": 2, "reps": 16, "charge": 19}, {"exerciceId": "ex46", "serie": 3, "reps": 13, "charge": 20}, {"exerciceId": "ex46", "serie": 4, "reps": 13, "charge": 20}, {"exerciceId": "ex47", "serie": 1, "reps": 16, "charge": 8}, {"exerciceId": "ex47", "serie": 2, "reps": 16, "charge": 8}, {"exerciceId": "ex47", "serie": 3, "reps": 13, "charge": 9}, {"exerciceId": "ex47", "serie": 4, "reps": 13, "charge": 9}, {"exerciceId": "ex48", "serie": 1, "reps": 16, "charge": 8}, {"exerciceId": "ex48", "serie": 2, "reps": 16, "charge": 8}, {"exerciceId": "ex48", "serie": 3, "reps": 13, "charge": 9}, {"exerciceId": "ex48", "serie": 4, "reps": 13, "charge": 9}]}, {"id": "se9", "date": "2026-08-17", "entries": [{"exerciceId": "ex1", "serie": 1, "reps": 14, "charge": 10}, {"exerciceId": "ex2", "serie": 1, "reps": 14, "charge": 24}, {"exerciceId": "ex3", "serie": 1, "reps": 14, "charge": 24}, {"exerciceId": "ex4", "serie": 1, "reps": 14, "charge": 12}, {"exerciceId": "ex5", "serie": 1, "reps": 17, "charge": 7}, {"exerciceId": "ex6", "serie": 1, "reps": 17, "charge": 10}, {"exerciceId": "ex7", "serie": 1, "reps": 14, "charge": 7}, {"exerciceId": "ex8", "serie": 1, "reps": 17, "charge": 48}, {"exerciceId": "ex8", "serie": 2, "reps": 17, "charge": 48}, {"exerciceId": "ex8", "serie": 3, "reps": 14, "charge": 50}, {"exerciceId": "ex8", "serie": 4, "reps": 14, "charge": 50}, {"exerciceId": "ex9", "serie": 1, "reps": 17, "charge": 68}, {"exerciceId": "ex9", "serie": 2, "reps": 17, "charge": 68}, {"exerciceId": "ex9", "serie": 3, "reps": 14, "charge": 70}, {"exerciceId": "ex9", "serie": 4, "reps": 14, "charge": 70}, {"exerciceId": "ex10", "serie": 1, "reps": 17, "charge": 53}, {"exerciceId": "ex10", "serie": 2, "reps": 17, "charge": 53}, {"exerciceId": "ex10", "serie": 3, "reps": 14, "charge": 55}, {"exerciceId": "ex10", "serie": 4, "reps": 14, "charge": 55}, {"exerciceId": "ex11", "serie": 1, "reps": 17, "charge": 38}, {"exerciceId": "ex11", "serie": 2, "reps": 17, "charge": 38}, {"exerciceId": "ex11", "serie": 3, "reps": 14, "charge": 40}, {"exerciceId": "ex11", "serie": 4, "reps": 14, "charge": 40}, {"exerciceId": "ex12", "serie": 1, "reps": 17, "charge": 58}, {"exerciceId": "ex12", "serie": 2, "reps": 17, "charge": 58}, {"exerciceId": "ex12", "serie": 3, "reps": 14, "charge": 60}, {"exerciceId": "ex12", "serie": 4, "reps": 14, "charge": 60}, {"exerciceId": "ex13", "serie": 1, "reps": 17, "charge": 38}, {"exerciceId": "ex13", "serie": 2, "reps": 17, "charge": 38}, {"exerciceId": "ex13", "serie": 3, "reps": 14, "charge": 40}, {"exerciceId": "ex13", "serie": 4, "reps": 14, "charge": 40}, {"exerciceId": "ex14", "serie": 1, "reps": 17, "charge": 43}, {"exerciceId": "ex14", "serie": 2, "reps": 17, "charge": 43}, {"exerciceId": "ex14", "serie": 3, "reps": 14, "charge": 45}, {"exerciceId": "ex14", "serie": 4, "reps": 14, "charge": 45}, {"exerciceId": "ex16", "serie": 1, "reps": 17, "charge": 43}, {"exerciceId": "ex16", "serie": 2, "reps": 17, "charge": 43}, {"exerciceId": "ex16", "serie": 3, "reps": 14, "charge": 45}, {"exerciceId": "ex16", "serie": 4, "reps": 14, "charge": 45}, {"exerciceId": "ex18", "serie": 1, "reps": 17, "charge": 28}, {"exerciceId": "ex18", "serie": 2, "reps": 17, "charge": 28}, {"exerciceId": "ex18", "serie": 3, "reps": 14, "charge": 30}, {"exerciceId": "ex18", "serie": 4, "reps": 14, "charge": 30}, {"exerciceId": "ex20", "serie": 1, "reps": 17, "charge": 33}, {"exerciceId": "ex20", "serie": 2, "reps": 17, "charge": 33}, {"exerciceId": "ex20", "serie": 3, "reps": 14, "charge": 35}, {"exerciceId": "ex20", "serie": 4, "reps": 14, "charge": 35}, {"exerciceId": "ex21", "serie": 1, "reps": 17, "charge": 38}, {"exerciceId": "ex21", "serie": 2, "reps": 17, "charge": 38}, {"exerciceId": "ex21", "serie": 3, "reps": 14, "charge": 40}, {"exerciceId": "ex21", "serie": 4, "reps": 14, "charge": 40}, {"exerciceId": "ex23", "serie": 1, "reps": 17, "charge": 68}, {"exerciceId": "ex23", "serie": 2, "reps": 17, "charge": 68}, {"exerciceId": "ex23", "serie": 3, "reps": 14, "charge": 70}, {"exerciceId": "ex23", "serie": 4, "reps": 14, "charge": 70}, {"exerciceId": "ex24", "serie": 1, "reps": 17, "charge": 43}, {"exerciceId": "ex24", "serie": 2, "reps": 17, "charge": 43}, {"exerciceId": "ex24", "serie": 3, "reps": 14, "charge": 45}, {"exerciceId": "ex24", "serie": 4, "reps": 14, "charge": 45}, {"exerciceId": "ex25", "serie": 1, "reps": 17, "charge": 43}, {"exerciceId": "ex25", "serie": 2, "reps": 17, "charge": 43}, {"exerciceId": "ex25", "serie": 3, "reps": 14, "charge": 45}, {"exerciceId": "ex25", "serie": 4, "reps": 14, "charge": 45}, {"exerciceId": "ex27", "serie": 1, "reps": 17, "charge": 33}, {"exerciceId": "ex27", "serie": 2, "reps": 17, "charge": 33}, {"exerciceId": "ex27", "serie": 3, "reps": 14, "charge": 35}, {"exerciceId": "ex27", "serie": 4, "reps": 14, "charge": 35}, {"exerciceId": "ex28", "serie": 1, "reps": 17, "charge": 33}, {"exerciceId": "ex28", "serie": 2, "reps": 17, "charge": 33}, {"exerciceId": "ex28", "serie": 3, "reps": 14, "charge": 35}, {"exerciceId": "ex28", "serie": 4, "reps": 14, "charge": 35}, {"exerciceId": "ex29", "serie": 1, "reps": 17, "charge": 16}, {"exerciceId": "ex29", "serie": 2, "reps": 17, "charge": 16}, {"exerciceId": "ex29", "serie": 3, "reps": 14, "charge": 17}, {"exerciceId": "ex29", "serie": 4, "reps": 14, "charge": 17}, {"exerciceId": "ex30", "serie": 1, "reps": 17, "charge": 28}, {"exerciceId": "ex30", "serie": 2, "reps": 17, "charge": 28}, {"exerciceId": "ex30", "serie": 3, "reps": 14, "charge": 30}, {"exerciceId": "ex30", "serie": 4, "reps": 14, "charge": 30}, {"exerciceId": "ex31", "serie": 1, "reps": 17, "charge": 33}, {"exerciceId": "ex31", "serie": 2, "reps": 17, "charge": 33}, {"exerciceId": "ex31", "serie": 3, "reps": 14, "charge": 35}, {"exerciceId": "ex31", "serie": 4, "reps": 14, "charge": 35}, {"exerciceId": "ex33", "serie": 1, "reps": 17, "charge": 19}, {"exerciceId": "ex33", "serie": 2, "reps": 17, "charge": 19}, {"exerciceId": "ex33", "serie": 3, "reps": 14, "charge": 20}, {"exerciceId": "ex33", "serie": 4, "reps": 14, "charge": 20}, {"exerciceId": "ex34", "serie": 1, "reps": 17, "charge": 28}, {"exerciceId": "ex34", "serie": 2, "reps": 17, "charge": 28}, {"exerciceId": "ex34", "serie": 3, "reps": 14, "charge": 30}, {"exerciceId": "ex34", "serie": 4, "reps": 14, "charge": 30}, {"exerciceId": "ex36", "serie": 1, "reps": 17, "charge": 10}, {"exerciceId": "ex36", "serie": 2, "reps": 17, "charge": 10}, {"exerciceId": "ex36", "serie": 3, "reps": 14, "charge": 11}, {"exerciceId": "ex36", "serie": 4, "reps": 14, "charge": 11}, {"exerciceId": "ex42", "serie": 1, "reps": 42, "charge": 9}, {"exerciceId": "ex42", "serie": 2, "reps": 42, "charge": 9}, {"exerciceId": "ex42", "serie": 3, "reps": 37, "charge": 10}, {"exerciceId": "ex42", "serie": 4, "reps": 37, "charge": 10}, {"exerciceId": "ex43", "serie": 1, "reps": 42, "charge": 9}, {"exerciceId": "ex43", "serie": 2, "reps": 42, "charge": 9}, {"exerciceId": "ex43", "serie": 3, "reps": 37, "charge": 10}, {"exerciceId": "ex43", "serie": 4, "reps": 37, "charge": 10}, {"exerciceId": "ex44", "serie": 1, "reps": 42, "charge": 9}, {"exerciceId": "ex44", "serie": 2, "reps": 42, "charge": 9}, {"exerciceId": "ex44", "serie": 3, "reps": 37, "charge": 10}, {"exerciceId": "ex44", "serie": 4, "reps": 37, "charge": 10}, {"exerciceId": "ex45", "serie": 1, "reps": 17, "charge": 12}, {"exerciceId": "ex45", "serie": 2, "reps": 17, "charge": 12}, {"exerciceId": "ex45", "serie": 3, "reps": 14, "charge": 13}, {"exerciceId": "ex45", "serie": 4, "reps": 14, "charge": 13}, {"exerciceId": "ex46", "serie": 1, "reps": 17, "charge": 20}, {"exerciceId": "ex46", "serie": 2, "reps": 17, "charge": 20}, {"exerciceId": "ex46", "serie": 3, "reps": 14, "charge": 21}, {"exerciceId": "ex46", "serie": 4, "reps": 14, "charge": 21}, {"exerciceId": "ex47", "serie": 1, "reps": 17, "charge": 9}, {"exerciceId": "ex47", "serie": 2, "reps": 17, "charge": 9}, {"exerciceId": "ex47", "serie": 3, "reps": 14, "charge": 10}, {"exerciceId": "ex47", "serie": 4, "reps": 14, "charge": 10}, {"exerciceId": "ex48", "serie": 1, "reps": 17, "charge": 9}, {"exerciceId": "ex48", "serie": 2, "reps": 17, "charge": 9}, {"exerciceId": "ex48", "serie": 3, "reps": 14, "charge": 10}, {"exerciceId": "ex48", "serie": 4, "reps": 14, "charge": 10}]}, {"id": "se10", "date": "2026-08-20", "entries": [{"exerciceId": "ex1", "serie": 1, "reps": 14, "charge": 11}, {"exerciceId": "ex2", "serie": 1, "reps": 14, "charge": 26}, {"exerciceId": "ex3", "serie": 1, "reps": 14, "charge": 26}, {"exerciceId": "ex4", "serie": 1, "reps": 14, "charge": 13}, {"exerciceId": "ex5", "serie": 1, "reps": 17, "charge": 8}, {"exerciceId": "ex6", "serie": 1, "reps": 17, "charge": 11}, {"exerciceId": "ex7", "serie": 1, "reps": 14, "charge": 8}, {"exerciceId": "ex8", "serie": 1, "reps": 17, "charge": 48}, {"exerciceId": "ex8", "serie": 2, "reps": 17, "charge": 48}, {"exerciceId": "ex8", "serie": 3, "reps": 14, "charge": 50}, {"exerciceId": "ex8", "serie": 4, "reps": 14, "charge": 50}, {"exerciceId": "ex9", "serie": 1, "reps": 17, "charge": 68}, {"exerciceId": "ex9", "serie": 2, "reps": 17, "charge": 68}, {"exerciceId": "ex9", "serie": 3, "reps": 14, "charge": 70}, {"exerciceId": "ex9", "serie": 4, "reps": 14, "charge": 70}, {"exerciceId": "ex10", "serie": 1, "reps": 17, "charge": 53}, {"exerciceId": "ex10", "serie": 2, "reps": 17, "charge": 53}, {"exerciceId": "ex10", "serie": 3, "reps": 14, "charge": 55}, {"exerciceId": "ex10", "serie": 4, "reps": 14, "charge": 55}, {"exerciceId": "ex11", "serie": 1, "reps": 17, "charge": 38}, {"exerciceId": "ex11", "serie": 2, "reps": 17, "charge": 38}, {"exerciceId": "ex11", "serie": 3, "reps": 14, "charge": 40}, {"exerciceId": "ex11", "serie": 4, "reps": 14, "charge": 40}, {"exerciceId": "ex12", "serie": 1, "reps": 17, "charge": 58}, {"exerciceId": "ex12", "serie": 2, "reps": 17, "charge": 58}, {"exerciceId": "ex12", "serie": 3, "reps": 14, "charge": 60}, {"exerciceId": "ex12", "serie": 4, "reps": 14, "charge": 60}, {"exerciceId": "ex13", "serie": 1, "reps": 17, "charge": 38}, {"exerciceId": "ex13", "serie": 2, "reps": 17, "charge": 38}, {"exerciceId": "ex13", "serie": 3, "reps": 14, "charge": 40}, {"exerciceId": "ex13", "serie": 4, "reps": 14, "charge": 40}, {"exerciceId": "ex14", "serie": 1, "reps": 17, "charge": 43}, {"exerciceId": "ex14", "serie": 2, "reps": 17, "charge": 43}, {"exerciceId": "ex14", "serie": 3, "reps": 14, "charge": 45}, {"exerciceId": "ex14", "serie": 4, "reps": 14, "charge": 45}, {"exerciceId": "ex16", "serie": 1, "reps": 17, "charge": 43}, {"exerciceId": "ex16", "serie": 2, "reps": 17, "charge": 43}, {"exerciceId": "ex16", "serie": 3, "reps": 14, "charge": 45}, {"exerciceId": "ex16", "serie": 4, "reps": 14, "charge": 45}, {"exerciceId": "ex18", "serie": 1, "reps": 17, "charge": 28}, {"exerciceId": "ex18", "serie": 2, "reps": 17, "charge": 28}, {"exerciceId": "ex18", "serie": 3, "reps": 14, "charge": 30}, {"exerciceId": "ex18", "serie": 4, "reps": 14, "charge": 30}, {"exerciceId": "ex20", "serie": 1, "reps": 17, "charge": 33}, {"exerciceId": "ex20", "serie": 2, "reps": 17, "charge": 33}, {"exerciceId": "ex20", "serie": 3, "reps": 14, "charge": 35}, {"exerciceId": "ex20", "serie": 4, "reps": 14, "charge": 35}, {"exerciceId": "ex21", "serie": 1, "reps": 17, "charge": 38}, {"exerciceId": "ex21", "serie": 2, "reps": 17, "charge": 38}, {"exerciceId": "ex21", "serie": 3, "reps": 14, "charge": 40}, {"exerciceId": "ex21", "serie": 4, "reps": 14, "charge": 40}, {"exerciceId": "ex23", "serie": 1, "reps": 17, "charge": 68}, {"exerciceId": "ex23", "serie": 2, "reps": 17, "charge": 68}, {"exerciceId": "ex23", "serie": 3, "reps": 14, "charge": 70}, {"exerciceId": "ex23", "serie": 4, "reps": 14, "charge": 70}, {"exerciceId": "ex24", "serie": 1, "reps": 17, "charge": 43}, {"exerciceId": "ex24", "serie": 2, "reps": 17, "charge": 43}, {"exerciceId": "ex24", "serie": 3, "reps": 14, "charge": 45}, {"exerciceId": "ex24", "serie": 4, "reps": 14, "charge": 45}, {"exerciceId": "ex25", "serie": 1, "reps": 17, "charge": 43}, {"exerciceId": "ex25", "serie": 2, "reps": 17, "charge": 43}, {"exerciceId": "ex25", "serie": 3, "reps": 14, "charge": 45}, {"exerciceId": "ex25", "serie": 4, "reps": 14, "charge": 45}, {"exerciceId": "ex27", "serie": 1, "reps": 17, "charge": 33}, {"exerciceId": "ex27", "serie": 2, "reps": 17, "charge": 33}, {"exerciceId": "ex27", "serie": 3, "reps": 14, "charge": 35}, {"exerciceId": "ex27", "serie": 4, "reps": 14, "charge": 35}, {"exerciceId": "ex28", "serie": 1, "reps": 17, "charge": 33}, {"exerciceId": "ex28", "serie": 2, "reps": 17, "charge": 33}, {"exerciceId": "ex28", "serie": 3, "reps": 14, "charge": 35}, {"exerciceId": "ex28", "serie": 4, "reps": 14, "charge": 35}, {"exerciceId": "ex29", "serie": 1, "reps": 17, "charge": 16}, {"exerciceId": "ex29", "serie": 2, "reps": 17, "charge": 16}, {"exerciceId": "ex29", "serie": 3, "reps": 14, "charge": 17}, {"exerciceId": "ex29", "serie": 4, "reps": 14, "charge": 17}, {"exerciceId": "ex30", "serie": 1, "reps": 17, "charge": 28}, {"exerciceId": "ex30", "serie": 2, "reps": 17, "charge": 28}, {"exerciceId": "ex30", "serie": 3, "reps": 14, "charge": 30}, {"exerciceId": "ex30", "serie": 4, "reps": 14, "charge": 30}, {"exerciceId": "ex31", "serie": 1, "reps": 17, "charge": 33}, {"exerciceId": "ex31", "serie": 2, "reps": 17, "charge": 33}, {"exerciceId": "ex31", "serie": 3, "reps": 14, "charge": 35}, {"exerciceId": "ex31", "serie": 4, "reps": 14, "charge": 35}, {"exerciceId": "ex33", "serie": 1, "reps": 17, "charge": 19}, {"exerciceId": "ex33", "serie": 2, "reps": 17, "charge": 19}, {"exerciceId": "ex33", "serie": 3, "reps": 14, "charge": 20}, {"exerciceId": "ex33", "serie": 4, "reps": 14, "charge": 20}, {"exerciceId": "ex34", "serie": 1, "reps": 17, "charge": 28}, {"exerciceId": "ex34", "serie": 2, "reps": 17, "charge": 28}, {"exerciceId": "ex34", "serie": 3, "reps": 14, "charge": 30}, {"exerciceId": "ex34", "serie": 4, "reps": 14, "charge": 30}, {"exerciceId": "ex36", "serie": 1, "reps": 17, "charge": 10}, {"exerciceId": "ex36", "serie": 2, "reps": 17, "charge": 10}, {"exerciceId": "ex36", "serie": 3, "reps": 14, "charge": 11}, {"exerciceId": "ex36", "serie": 4, "reps": 14, "charge": 11}, {"exerciceId": "ex42", "serie": 1, "reps": 42, "charge": 9}, {"exerciceId": "ex42", "serie": 2, "reps": 42, "charge": 9}, {"exerciceId": "ex42", "serie": 3, "reps": 37, "charge": 10}, {"exerciceId": "ex42", "serie": 4, "reps": 37, "charge": 10}, {"exerciceId": "ex43", "serie": 1, "reps": 42, "charge": 9}, {"exerciceId": "ex43", "serie": 2, "reps": 42, "charge": 9}, {"exerciceId": "ex43", "serie": 3, "reps": 37, "charge": 10}, {"exerciceId": "ex43", "serie": 4, "reps": 37, "charge": 10}, {"exerciceId": "ex44", "serie": 1, "reps": 42, "charge": 9}, {"exerciceId": "ex44", "serie": 2, "reps": 42, "charge": 9}, {"exerciceId": "ex44", "serie": 3, "reps": 37, "charge": 10}, {"exerciceId": "ex44", "serie": 4, "reps": 37, "charge": 10}, {"exerciceId": "ex45", "serie": 1, "reps": 17, "charge": 12}, {"exerciceId": "ex45", "serie": 2, "reps": 17, "charge": 12}, {"exerciceId": "ex45", "serie": 3, "reps": 14, "charge": 13}, {"exerciceId": "ex45", "serie": 4, "reps": 14, "charge": 13}, {"exerciceId": "ex46", "serie": 1, "reps": 17, "charge": 20}, {"exerciceId": "ex46", "serie": 2, "reps": 17, "charge": 20}, {"exerciceId": "ex46", "serie": 3, "reps": 14, "charge": 21}, {"exerciceId": "ex46", "serie": 4, "reps": 14, "charge": 21}, {"exerciceId": "ex47", "serie": 1, "reps": 17, "charge": 9}, {"exerciceId": "ex47", "serie": 2, "reps": 17, "charge": 9}, {"exerciceId": "ex47", "serie": 3, "reps": 14, "charge": 10}, {"exerciceId": "ex47", "serie": 4, "reps": 14, "charge": 10}, {"exerciceId": "ex48", "serie": 1, "reps": 17, "charge": 9}, {"exerciceId": "ex48", "serie": 2, "reps": 17, "charge": 9}, {"exerciceId": "ex48", "serie": 3, "reps": 14, "charge": 10}, {"exerciceId": "ex48", "serie": 4, "reps": 14, "charge": 10}]}, {"id": "se11", "date": "2026-08-24", "entries": [{"exerciceId": "ex1", "serie": 1, "reps": 14, "charge": 11}, {"exerciceId": "ex2", "serie": 1, "reps": 14, "charge": 26}, {"exerciceId": "ex3", "serie": 1, "reps": 14, "charge": 26}, {"exerciceId": "ex4", "serie": 1, "reps": 14, "charge": 13}, {"exerciceId": "ex5", "serie": 1, "reps": 17, "charge": 8}, {"exerciceId": "ex6", "serie": 1, "reps": 17, "charge": 11}, {"exerciceId": "ex7", "serie": 1, "reps": 14, "charge": 8}, {"exerciceId": "ex8", "serie": 1, "reps": 17, "charge": 50}, {"exerciceId": "ex8", "serie": 2, "reps": 17, "charge": 50}, {"exerciceId": "ex8", "serie": 3, "reps": 14, "charge": 52}, {"exerciceId": "ex8", "serie": 4, "reps": 14, "charge": 52}, {"exerciceId": "ex9", "serie": 1, "reps": 17, "charge": 70}, {"exerciceId": "ex9", "serie": 2, "reps": 17, "charge": 70}, {"exerciceId": "ex9", "serie": 3, "reps": 14, "charge": 72}, {"exerciceId": "ex9", "serie": 4, "reps": 14, "charge": 72}, {"exerciceId": "ex10", "serie": 1, "reps": 17, "charge": 55}, {"exerciceId": "ex10", "serie": 2, "reps": 17, "charge": 55}, {"exerciceId": "ex10", "serie": 3, "reps": 14, "charge": 57}, {"exerciceId": "ex10", "serie": 4, "reps": 14, "charge": 57}, {"exerciceId": "ex11", "serie": 1, "reps": 17, "charge": 40}, {"exerciceId": "ex11", "serie": 2, "reps": 17, "charge": 40}, {"exerciceId": "ex11", "serie": 3, "reps": 14, "charge": 42}, {"exerciceId": "ex11", "serie": 4, "reps": 14, "charge": 42}, {"exerciceId": "ex12", "serie": 1, "reps": 17, "charge": 60}, {"exerciceId": "ex12", "serie": 2, "reps": 17, "charge": 60}, {"exerciceId": "ex12", "serie": 3, "reps": 14, "charge": 62}, {"exerciceId": "ex12", "serie": 4, "reps": 14, "charge": 62}, {"exerciceId": "ex13", "serie": 1, "reps": 17, "charge": 40}, {"exerciceId": "ex13", "serie": 2, "reps": 17, "charge": 40}, {"exerciceId": "ex13", "serie": 3, "reps": 14, "charge": 42}, {"exerciceId": "ex13", "serie": 4, "reps": 14, "charge": 42}, {"exerciceId": "ex14", "serie": 1, "reps": 17, "charge": 45}, {"exerciceId": "ex14", "serie": 2, "reps": 17, "charge": 45}, {"exerciceId": "ex14", "serie": 3, "reps": 14, "charge": 47}, {"exerciceId": "ex14", "serie": 4, "reps": 14, "charge": 47}, {"exerciceId": "ex16", "serie": 1, "reps": 17, "charge": 45}, {"exerciceId": "ex16", "serie": 2, "reps": 17, "charge": 45}, {"exerciceId": "ex16", "serie": 3, "reps": 14, "charge": 47}, {"exerciceId": "ex16", "serie": 4, "reps": 14, "charge": 47}, {"exerciceId": "ex18", "serie": 1, "reps": 17, "charge": 30}, {"exerciceId": "ex18", "serie": 2, "reps": 17, "charge": 30}, {"exerciceId": "ex18", "serie": 3, "reps": 14, "charge": 32}, {"exerciceId": "ex18", "serie": 4, "reps": 14, "charge": 32}, {"exerciceId": "ex20", "serie": 1, "reps": 17, "charge": 35}, {"exerciceId": "ex20", "serie": 2, "reps": 17, "charge": 35}, {"exerciceId": "ex20", "serie": 3, "reps": 14, "charge": 37}, {"exerciceId": "ex20", "serie": 4, "reps": 14, "charge": 37}, {"exerciceId": "ex21", "serie": 1, "reps": 17, "charge": 40}, {"exerciceId": "ex21", "serie": 2, "reps": 17, "charge": 40}, {"exerciceId": "ex21", "serie": 3, "reps": 14, "charge": 42}, {"exerciceId": "ex21", "serie": 4, "reps": 14, "charge": 42}, {"exerciceId": "ex23", "serie": 1, "reps": 17, "charge": 70}, {"exerciceId": "ex23", "serie": 2, "reps": 17, "charge": 70}, {"exerciceId": "ex23", "serie": 3, "reps": 14, "charge": 72}, {"exerciceId": "ex23", "serie": 4, "reps": 14, "charge": 72}, {"exerciceId": "ex24", "serie": 1, "reps": 17, "charge": 45}, {"exerciceId": "ex24", "serie": 2, "reps": 17, "charge": 45}, {"exerciceId": "ex24", "serie": 3, "reps": 14, "charge": 47}, {"exerciceId": "ex24", "serie": 4, "reps": 14, "charge": 47}, {"exerciceId": "ex25", "serie": 1, "reps": 17, "charge": 45}, {"exerciceId": "ex25", "serie": 2, "reps": 17, "charge": 45}, {"exerciceId": "ex25", "serie": 3, "reps": 14, "charge": 47}, {"exerciceId": "ex25", "serie": 4, "reps": 14, "charge": 47}, {"exerciceId": "ex27", "serie": 1, "reps": 17, "charge": 35}, {"exerciceId": "ex27", "serie": 2, "reps": 17, "charge": 35}, {"exerciceId": "ex27", "serie": 3, "reps": 14, "charge": 37}, {"exerciceId": "ex27", "serie": 4, "reps": 14, "charge": 37}, {"exerciceId": "ex28", "serie": 1, "reps": 17, "charge": 35}, {"exerciceId": "ex28", "serie": 2, "reps": 17, "charge": 35}, {"exerciceId": "ex28", "serie": 3, "reps": 14, "charge": 37}, {"exerciceId": "ex28", "serie": 4, "reps": 14, "charge": 37}, {"exerciceId": "ex29", "serie": 1, "reps": 17, "charge": 17}, {"exerciceId": "ex29", "serie": 2, "reps": 17, "charge": 17}, {"exerciceId": "ex29", "serie": 3, "reps": 14, "charge": 18}, {"exerciceId": "ex29", "serie": 4, "reps": 14, "charge": 18}, {"exerciceId": "ex30", "serie": 1, "reps": 17, "charge": 30}, {"exerciceId": "ex30", "serie": 2, "reps": 17, "charge": 30}, {"exerciceId": "ex30", "serie": 3, "reps": 14, "charge": 32}, {"exerciceId": "ex30", "serie": 4, "reps": 14, "charge": 32}, {"exerciceId": "ex31", "serie": 1, "reps": 17, "charge": 35}, {"exerciceId": "ex31", "serie": 2, "reps": 17, "charge": 35}, {"exerciceId": "ex31", "serie": 3, "reps": 14, "charge": 37}, {"exerciceId": "ex31", "serie": 4, "reps": 14, "charge": 37}, {"exerciceId": "ex33", "serie": 1, "reps": 17, "charge": 20}, {"exerciceId": "ex33", "serie": 2, "reps": 17, "charge": 20}, {"exerciceId": "ex33", "serie": 3, "reps": 14, "charge": 21}, {"exerciceId": "ex33", "serie": 4, "reps": 14, "charge": 21}, {"exerciceId": "ex34", "serie": 1, "reps": 17, "charge": 30}, {"exerciceId": "ex34", "serie": 2, "reps": 17, "charge": 30}, {"exerciceId": "ex34", "serie": 3, "reps": 14, "charge": 32}, {"exerciceId": "ex34", "serie": 4, "reps": 14, "charge": 32}, {"exerciceId": "ex36", "serie": 1, "reps": 17, "charge": 11}, {"exerciceId": "ex36", "serie": 2, "reps": 17, "charge": 11}, {"exerciceId": "ex36", "serie": 3, "reps": 14, "charge": 12}, {"exerciceId": "ex36", "serie": 4, "reps": 14, "charge": 12}, {"exerciceId": "ex42", "serie": 1, "reps": 45, "charge": 10}, {"exerciceId": "ex42", "serie": 2, "reps": 45, "charge": 10}, {"exerciceId": "ex42", "serie": 3, "reps": 40, "charge": 11}, {"exerciceId": "ex42", "serie": 4, "reps": 40, "charge": 11}, {"exerciceId": "ex43", "serie": 1, "reps": 45, "charge": 10}, {"exerciceId": "ex43", "serie": 2, "reps": 45, "charge": 10}, {"exerciceId": "ex43", "serie": 3, "reps": 40, "charge": 11}, {"exerciceId": "ex43", "serie": 4, "reps": 40, "charge": 11}, {"exerciceId": "ex44", "serie": 1, "reps": 45, "charge": 10}, {"exerciceId": "ex44", "serie": 2, "reps": 45, "charge": 10}, {"exerciceId": "ex44", "serie": 3, "reps": 40, "charge": 11}, {"exerciceId": "ex44", "serie": 4, "reps": 40, "charge": 11}, {"exerciceId": "ex45", "serie": 1, "reps": 17, "charge": 13}, {"exerciceId": "ex45", "serie": 2, "reps": 17, "charge": 13}, {"exerciceId": "ex45", "serie": 3, "reps": 14, "charge": 14}, {"exerciceId": "ex45", "serie": 4, "reps": 14, "charge": 14}, {"exerciceId": "ex46", "serie": 1, "reps": 17, "charge": 21}, {"exerciceId": "ex46", "serie": 2, "reps": 17, "charge": 21}, {"exerciceId": "ex46", "serie": 3, "reps": 14, "charge": 22}, {"exerciceId": "ex46", "serie": 4, "reps": 14, "charge": 22}, {"exerciceId": "ex47", "serie": 1, "reps": 17, "charge": 10}, {"exerciceId": "ex47", "serie": 2, "reps": 17, "charge": 10}, {"exerciceId": "ex47", "serie": 3, "reps": 14, "charge": 11}, {"exerciceId": "ex47", "serie": 4, "reps": 14, "charge": 11}, {"exerciceId": "ex48", "serie": 1, "reps": 17, "charge": 10}, {"exerciceId": "ex48", "serie": 2, "reps": 17, "charge": 10}, {"exerciceId": "ex48", "serie": 3, "reps": 14, "charge": 11}, {"exerciceId": "ex48", "serie": 4, "reps": 14, "charge": 11}]}, {"id": "se12", "date": "2026-08-27", "entries": [{"exerciceId": "ex1", "serie": 1, "reps": 14, "charge": 11}, {"exerciceId": "ex2", "serie": 1, "reps": 14, "charge": 26}, {"exerciceId": "ex3", "serie": 1, "reps": 14, "charge": 26}, {"exerciceId": "ex4", "serie": 1, "reps": 14, "charge": 13}, {"exerciceId": "ex5", "serie": 1, "reps": 17, "charge": 8}, {"exerciceId": "ex6", "serie": 1, "reps": 17, "charge": 11}, {"exerciceId": "ex7", "serie": 1, "reps": 14, "charge": 8}, {"exerciceId": "ex8", "serie": 1, "reps": 17, "charge": 50}, {"exerciceId": "ex8", "serie": 2, "reps": 17, "charge": 50}, {"exerciceId": "ex8", "serie": 3, "reps": 14, "charge": 52}, {"exerciceId": "ex8", "serie": 4, "reps": 14, "charge": 52}, {"exerciceId": "ex9", "serie": 1, "reps": 17, "charge": 70}, {"exerciceId": "ex9", "serie": 2, "reps": 17, "charge": 70}, {"exerciceId": "ex9", "serie": 3, "reps": 14, "charge": 72}, {"exerciceId": "ex9", "serie": 4, "reps": 14, "charge": 72}, {"exerciceId": "ex10", "serie": 1, "reps": 17, "charge": 55}, {"exerciceId": "ex10", "serie": 2, "reps": 17, "charge": 55}, {"exerciceId": "ex10", "serie": 3, "reps": 14, "charge": 57}, {"exerciceId": "ex10", "serie": 4, "reps": 14, "charge": 57}, {"exerciceId": "ex11", "serie": 1, "reps": 17, "charge": 40}, {"exerciceId": "ex11", "serie": 2, "reps": 17, "charge": 40}, {"exerciceId": "ex11", "serie": 3, "reps": 14, "charge": 42}, {"exerciceId": "ex11", "serie": 4, "reps": 14, "charge": 42}, {"exerciceId": "ex12", "serie": 1, "reps": 17, "charge": 60}, {"exerciceId": "ex12", "serie": 2, "reps": 17, "charge": 60}, {"exerciceId": "ex12", "serie": 3, "reps": 14, "charge": 62}, {"exerciceId": "ex12", "serie": 4, "reps": 14, "charge": 62}, {"exerciceId": "ex13", "serie": 1, "reps": 17, "charge": 40}, {"exerciceId": "ex13", "serie": 2, "reps": 17, "charge": 40}, {"exerciceId": "ex13", "serie": 3, "reps": 14, "charge": 42}, {"exerciceId": "ex13", "serie": 4, "reps": 14, "charge": 42}, {"exerciceId": "ex14", "serie": 1, "reps": 17, "charge": 45}, {"exerciceId": "ex14", "serie": 2, "reps": 17, "charge": 45}, {"exerciceId": "ex14", "serie": 3, "reps": 14, "charge": 47}, {"exerciceId": "ex14", "serie": 4, "reps": 14, "charge": 47}, {"exerciceId": "ex16", "serie": 1, "reps": 17, "charge": 45}, {"exerciceId": "ex16", "serie": 2, "reps": 17, "charge": 45}, {"exerciceId": "ex16", "serie": 3, "reps": 14, "charge": 47}, {"exerciceId": "ex16", "serie": 4, "reps": 14, "charge": 47}, {"exerciceId": "ex18", "serie": 1, "reps": 17, "charge": 30}, {"exerciceId": "ex18", "serie": 2, "reps": 17, "charge": 30}, {"exerciceId": "ex18", "serie": 3, "reps": 14, "charge": 32}, {"exerciceId": "ex18", "serie": 4, "reps": 14, "charge": 32}, {"exerciceId": "ex20", "serie": 1, "reps": 17, "charge": 35}, {"exerciceId": "ex20", "serie": 2, "reps": 17, "charge": 35}, {"exerciceId": "ex20", "serie": 3, "reps": 14, "charge": 37}, {"exerciceId": "ex20", "serie": 4, "reps": 14, "charge": 37}, {"exerciceId": "ex21", "serie": 1, "reps": 17, "charge": 40}, {"exerciceId": "ex21", "serie": 2, "reps": 17, "charge": 40}, {"exerciceId": "ex21", "serie": 3, "reps": 14, "charge": 42}, {"exerciceId": "ex21", "serie": 4, "reps": 14, "charge": 42}, {"exerciceId": "ex23", "serie": 1, "reps": 17, "charge": 70}, {"exerciceId": "ex23", "serie": 2, "reps": 17, "charge": 70}, {"exerciceId": "ex23", "serie": 3, "reps": 14, "charge": 72}, {"exerciceId": "ex23", "serie": 4, "reps": 14, "charge": 72}, {"exerciceId": "ex24", "serie": 1, "reps": 17, "charge": 45}, {"exerciceId": "ex24", "serie": 2, "reps": 17, "charge": 45}, {"exerciceId": "ex24", "serie": 3, "reps": 14, "charge": 47}, {"exerciceId": "ex24", "serie": 4, "reps": 14, "charge": 47}, {"exerciceId": "ex25", "serie": 1, "reps": 17, "charge": 45}, {"exerciceId": "ex25", "serie": 2, "reps": 17, "charge": 45}, {"exerciceId": "ex25", "serie": 3, "reps": 14, "charge": 47}, {"exerciceId": "ex25", "serie": 4, "reps": 14, "charge": 47}, {"exerciceId": "ex27", "serie": 1, "reps": 17, "charge": 35}, {"exerciceId": "ex27", "serie": 2, "reps": 17, "charge": 35}, {"exerciceId": "ex27", "serie": 3, "reps": 14, "charge": 37}, {"exerciceId": "ex27", "serie": 4, "reps": 14, "charge": 37}, {"exerciceId": "ex28", "serie": 1, "reps": 17, "charge": 35}, {"exerciceId": "ex28", "serie": 2, "reps": 17, "charge": 35}, {"exerciceId": "ex28", "serie": 3, "reps": 14, "charge": 37}, {"exerciceId": "ex28", "serie": 4, "reps": 14, "charge": 37}, {"exerciceId": "ex29", "serie": 1, "reps": 17, "charge": 17}, {"exerciceId": "ex29", "serie": 2, "reps": 17, "charge": 17}, {"exerciceId": "ex29", "serie": 3, "reps": 14, "charge": 18}, {"exerciceId": "ex29", "serie": 4, "reps": 14, "charge": 18}, {"exerciceId": "ex30", "serie": 1, "reps": 17, "charge": 30}, {"exerciceId": "ex30", "serie": 2, "reps": 17, "charge": 30}, {"exerciceId": "ex30", "serie": 3, "reps": 14, "charge": 32}, {"exerciceId": "ex30", "serie": 4, "reps": 14, "charge": 32}, {"exerciceId": "ex31", "serie": 1, "reps": 17, "charge": 35}, {"exerciceId": "ex31", "serie": 2, "reps": 17, "charge": 35}, {"exerciceId": "ex31", "serie": 3, "reps": 14, "charge": 37}, {"exerciceId": "ex31", "serie": 4, "reps": 14, "charge": 37}, {"exerciceId": "ex33", "serie": 1, "reps": 17, "charge": 20}, {"exerciceId": "ex33", "serie": 2, "reps": 17, "charge": 20}, {"exerciceId": "ex33", "serie": 3, "reps": 14, "charge": 21}, {"exerciceId": "ex33", "serie": 4, "reps": 14, "charge": 21}, {"exerciceId": "ex34", "serie": 1, "reps": 17, "charge": 30}, {"exerciceId": "ex34", "serie": 2, "reps": 17, "charge": 30}, {"exerciceId": "ex34", "serie": 3, "reps": 14, "charge": 32}, {"exerciceId": "ex34", "serie": 4, "reps": 14, "charge": 32}, {"exerciceId": "ex36", "serie": 1, "reps": 17, "charge": 11}, {"exerciceId": "ex36", "serie": 2, "reps": 17, "charge": 11}, {"exerciceId": "ex36", "serie": 3, "reps": 14, "charge": 12}, {"exerciceId": "ex36", "serie": 4, "reps": 14, "charge": 12}, {"exerciceId": "ex42", "serie": 1, "reps": 45, "charge": 10}, {"exerciceId": "ex42", "serie": 2, "reps": 45, "charge": 10}, {"exerciceId": "ex42", "serie": 3, "reps": 40, "charge": 11}, {"exerciceId": "ex42", "serie": 4, "reps": 40, "charge": 11}, {"exerciceId": "ex43", "serie": 1, "reps": 45, "charge": 10}, {"exerciceId": "ex43", "serie": 2, "reps": 45, "charge": 10}, {"exerciceId": "ex43", "serie": 3, "reps": 40, "charge": 11}, {"exerciceId": "ex43", "serie": 4, "reps": 40, "charge": 11}, {"exerciceId": "ex44", "serie": 1, "reps": 45, "charge": 10}, {"exerciceId": "ex44", "serie": 2, "reps": 45, "charge": 10}, {"exerciceId": "ex44", "serie": 3, "reps": 40, "charge": 11}, {"exerciceId": "ex44", "serie": 4, "reps": 40, "charge": 11}, {"exerciceId": "ex45", "serie": 1, "reps": 17, "charge": 13}, {"exerciceId": "ex45", "serie": 2, "reps": 17, "charge": 13}, {"exerciceId": "ex45", "serie": 3, "reps": 14, "charge": 14}, {"exerciceId": "ex45", "serie": 4, "reps": 14, "charge": 14}, {"exerciceId": "ex46", "serie": 1, "reps": 17, "charge": 21}, {"exerciceId": "ex46", "serie": 2, "reps": 17, "charge": 21}, {"exerciceId": "ex46", "serie": 3, "reps": 14, "charge": 22}, {"exerciceId": "ex46", "serie": 4, "reps": 14, "charge": 22}, {"exerciceId": "ex47", "serie": 1, "reps": 17, "charge": 10}, {"exerciceId": "ex47", "serie": 2, "reps": 17, "charge": 10}, {"exerciceId": "ex47", "serie": 3, "reps": 14, "charge": 11}, {"exerciceId": "ex47", "serie": 4, "reps": 14, "charge": 11}, {"exerciceId": "ex48", "serie": 1, "reps": 17, "charge": 10}, {"exerciceId": "ex48", "serie": 2, "reps": 17, "charge": 10}, {"exerciceId": "ex48", "serie": 3, "reps": 14, "charge": 11}, {"exerciceId": "ex48", "serie": 4, "reps": 14, "charge": 11}]}, {"id": "se13", "date": "2026-08-31", "entries": [{"exerciceId": "ex1", "serie": 1, "reps": 15, "charge": 12}, {"exerciceId": "ex2", "serie": 1, "reps": 15, "charge": 28}, {"exerciceId": "ex3", "serie": 1, "reps": 15, "charge": 28}, {"exerciceId": "ex4", "serie": 1, "reps": 15, "charge": 14}, {"exerciceId": "ex5", "serie": 1, "reps": 18, "charge": 9}, {"exerciceId": "ex6", "serie": 1, "reps": 18, "charge": 12}, {"exerciceId": "ex7", "serie": 1, "reps": 15, "charge": 9}, {"exerciceId": "ex8", "serie": 1, "reps": 18, "charge": 52}, {"exerciceId": "ex8", "serie": 2, "reps": 18, "charge": 52}, {"exerciceId": "ex8", "serie": 3, "reps": 15, "charge": 54}, {"exerciceId": "ex8", "serie": 4, "reps": 15, "charge": 54}, {"exerciceId": "ex9", "serie": 1, "reps": 18, "charge": 72}, {"exerciceId": "ex9", "serie": 2, "reps": 18, "charge": 72}, {"exerciceId": "ex9", "serie": 3, "reps": 15, "charge": 74}, {"exerciceId": "ex9", "serie": 4, "reps": 15, "charge": 74}, {"exerciceId": "ex10", "serie": 1, "reps": 18, "charge": 57}, {"exerciceId": "ex10", "serie": 2, "reps": 18, "charge": 57}, {"exerciceId": "ex10", "serie": 3, "reps": 15, "charge": 59}, {"exerciceId": "ex10", "serie": 4, "reps": 15, "charge": 59}, {"exerciceId": "ex11", "serie": 1, "reps": 18, "charge": 42}, {"exerciceId": "ex11", "serie": 2, "reps": 18, "charge": 42}, {"exerciceId": "ex11", "serie": 3, "reps": 15, "charge": 44}, {"exerciceId": "ex11", "serie": 4, "reps": 15, "charge": 44}, {"exerciceId": "ex12", "serie": 1, "reps": 18, "charge": 62}, {"exerciceId": "ex12", "serie": 2, "reps": 18, "charge": 62}, {"exerciceId": "ex12", "serie": 3, "reps": 15, "charge": 64}, {"exerciceId": "ex12", "serie": 4, "reps": 15, "charge": 64}, {"exerciceId": "ex13", "serie": 1, "reps": 18, "charge": 42}, {"exerciceId": "ex13", "serie": 2, "reps": 18, "charge": 42}, {"exerciceId": "ex13", "serie": 3, "reps": 15, "charge": 44}, {"exerciceId": "ex13", "serie": 4, "reps": 15, "charge": 44}, {"exerciceId": "ex14", "serie": 1, "reps": 18, "charge": 47}, {"exerciceId": "ex14", "serie": 2, "reps": 18, "charge": 47}, {"exerciceId": "ex14", "serie": 3, "reps": 15, "charge": 49}, {"exerciceId": "ex14", "serie": 4, "reps": 15, "charge": 49}, {"exerciceId": "ex16", "serie": 1, "reps": 18, "charge": 47}, {"exerciceId": "ex16", "serie": 2, "reps": 18, "charge": 47}, {"exerciceId": "ex16", "serie": 3, "reps": 15, "charge": 49}, {"exerciceId": "ex16", "serie": 4, "reps": 15, "charge": 49}, {"exerciceId": "ex18", "serie": 1, "reps": 18, "charge": 32}, {"exerciceId": "ex18", "serie": 2, "reps": 18, "charge": 32}, {"exerciceId": "ex18", "serie": 3, "reps": 15, "charge": 34}, {"exerciceId": "ex18", "serie": 4, "reps": 15, "charge": 34}, {"exerciceId": "ex20", "serie": 1, "reps": 18, "charge": 37}, {"exerciceId": "ex20", "serie": 2, "reps": 18, "charge": 37}, {"exerciceId": "ex20", "serie": 3, "reps": 15, "charge": 39}, {"exerciceId": "ex20", "serie": 4, "reps": 15, "charge": 39}, {"exerciceId": "ex21", "serie": 1, "reps": 18, "charge": 42}, {"exerciceId": "ex21", "serie": 2, "reps": 18, "charge": 42}, {"exerciceId": "ex21", "serie": 3, "reps": 15, "charge": 44}, {"exerciceId": "ex21", "serie": 4, "reps": 15, "charge": 44}, {"exerciceId": "ex23", "serie": 1, "reps": 18, "charge": 72}, {"exerciceId": "ex23", "serie": 2, "reps": 18, "charge": 72}, {"exerciceId": "ex23", "serie": 3, "reps": 15, "charge": 74}, {"exerciceId": "ex23", "serie": 4, "reps": 15, "charge": 74}, {"exerciceId": "ex24", "serie": 1, "reps": 18, "charge": 47}, {"exerciceId": "ex24", "serie": 2, "reps": 18, "charge": 47}, {"exerciceId": "ex24", "serie": 3, "reps": 15, "charge": 49}, {"exerciceId": "ex24", "serie": 4, "reps": 15, "charge": 49}, {"exerciceId": "ex25", "serie": 1, "reps": 18, "charge": 47}, {"exerciceId": "ex25", "serie": 2, "reps": 18, "charge": 47}, {"exerciceId": "ex25", "serie": 3, "reps": 15, "charge": 49}, {"exerciceId": "ex25", "serie": 4, "reps": 15, "charge": 49}, {"exerciceId": "ex27", "serie": 1, "reps": 18, "charge": 37}, {"exerciceId": "ex27", "serie": 2, "reps": 18, "charge": 37}, {"exerciceId": "ex27", "serie": 3, "reps": 15, "charge": 39}, {"exerciceId": "ex27", "serie": 4, "reps": 15, "charge": 39}, {"exerciceId": "ex28", "serie": 1, "reps": 18, "charge": 37}, {"exerciceId": "ex28", "serie": 2, "reps": 18, "charge": 37}, {"exerciceId": "ex28", "serie": 3, "reps": 15, "charge": 39}, {"exerciceId": "ex28", "serie": 4, "reps": 15, "charge": 39}, {"exerciceId": "ex29", "serie": 1, "reps": 18, "charge": 18}, {"exerciceId": "ex29", "serie": 2, "reps": 18, "charge": 18}, {"exerciceId": "ex29", "serie": 3, "reps": 15, "charge": 19}, {"exerciceId": "ex29", "serie": 4, "reps": 15, "charge": 19}, {"exerciceId": "ex30", "serie": 1, "reps": 18, "charge": 32}, {"exerciceId": "ex30", "serie": 2, "reps": 18, "charge": 32}, {"exerciceId": "ex30", "serie": 3, "reps": 15, "charge": 34}, {"exerciceId": "ex30", "serie": 4, "reps": 15, "charge": 34}, {"exerciceId": "ex31", "serie": 1, "reps": 18, "charge": 37}, {"exerciceId": "ex31", "serie": 2, "reps": 18, "charge": 37}, {"exerciceId": "ex31", "serie": 3, "reps": 15, "charge": 39}, {"exerciceId": "ex31", "serie": 4, "reps": 15, "charge": 39}, {"exerciceId": "ex33", "serie": 1, "reps": 18, "charge": 21}, {"exerciceId": "ex33", "serie": 2, "reps": 18, "charge": 21}, {"exerciceId": "ex33", "serie": 3, "reps": 15, "charge": 22}, {"exerciceId": "ex33", "serie": 4, "reps": 15, "charge": 22}, {"exerciceId": "ex34", "serie": 1, "reps": 18, "charge": 32}, {"exerciceId": "ex34", "serie": 2, "reps": 18, "charge": 32}, {"exerciceId": "ex34", "serie": 3, "reps": 15, "charge": 34}, {"exerciceId": "ex34", "serie": 4, "reps": 15, "charge": 34}, {"exerciceId": "ex36", "serie": 1, "reps": 18, "charge": 12}, {"exerciceId": "ex36", "serie": 2, "reps": 18, "charge": 12}, {"exerciceId": "ex36", "serie": 3, "reps": 15, "charge": 13}, {"exerciceId": "ex36", "serie": 4, "reps": 15, "charge": 13}, {"exerciceId": "ex42", "serie": 1, "reps": 48, "charge": 11}, {"exerciceId": "ex42", "serie": 2, "reps": 48, "charge": 11}, {"exerciceId": "ex42", "serie": 3, "reps": 43, "charge": 12}, {"exerciceId": "ex42", "serie": 4, "reps": 43, "charge": 12}, {"exerciceId": "ex43", "serie": 1, "reps": 48, "charge": 11}, {"exerciceId": "ex43", "serie": 2, "reps": 48, "charge": 11}, {"exerciceId": "ex43", "serie": 3, "reps": 43, "charge": 12}, {"exerciceId": "ex43", "serie": 4, "reps": 43, "charge": 12}, {"exerciceId": "ex44", "serie": 1, "reps": 48, "charge": 11}, {"exerciceId": "ex44", "serie": 2, "reps": 48, "charge": 11}, {"exerciceId": "ex44", "serie": 3, "reps": 43, "charge": 12}, {"exerciceId": "ex44", "serie": 4, "reps": 43, "charge": 12}, {"exerciceId": "ex45", "serie": 1, "reps": 18, "charge": 14}, {"exerciceId": "ex45", "serie": 2, "reps": 18, "charge": 14}, {"exerciceId": "ex45", "serie": 3, "reps": 15, "charge": 15}, {"exerciceId": "ex45", "serie": 4, "reps": 15, "charge": 15}, {"exerciceId": "ex46", "serie": 1, "reps": 18, "charge": 22}, {"exerciceId": "ex46", "serie": 2, "reps": 18, "charge": 22}, {"exerciceId": "ex46", "serie": 3, "reps": 15, "charge": 23}, {"exerciceId": "ex46", "serie": 4, "reps": 15, "charge": 23}, {"exerciceId": "ex47", "serie": 1, "reps": 18, "charge": 11}, {"exerciceId": "ex47", "serie": 2, "reps": 18, "charge": 11}, {"exerciceId": "ex47", "serie": 3, "reps": 15, "charge": 12}, {"exerciceId": "ex47", "serie": 4, "reps": 15, "charge": 12}, {"exerciceId": "ex48", "serie": 1, "reps": 18, "charge": 11}, {"exerciceId": "ex48", "serie": 2, "reps": 18, "charge": 11}, {"exerciceId": "ex48", "serie": 3, "reps": 15, "charge": 12}, {"exerciceId": "ex48", "serie": 4, "reps": 15, "charge": 12}]}, {"id": "se14", "date": "2026-09-02", "entries": [{"exerciceId": "ex11", "serie": 1, "reps": 18, "charge": 50}]}]}
;

const LIBRARY_KEY = "library-v1";
const CLIENTS_KEY = "clients-v1";
const ROLE_KEY = "role-choice-v1";
const CLIENT_CHOICE_KEY = "client-choice-v1";
const sessionsKey = (clientId) => `sessions-v1-${clientId}`;
const profileKey = (clientId) => `profile-v1-${clientId}`;

function uid(prefix) {
  return prefix + Math.random().toString(36).slice(2, 9);
}

const PROFILE_FIELDS = [
  { key: "passeSportif", label: "Passé sportif, activité" },
  { key: "presentSportif", label: "Présent sportif, activité" },
  { key: "objectifs", label: "Objectifs court, moyen, long terme" },
  { key: "sante", label: "Santé" },
  { key: "alimentation", label: "Alimentation" },
  { key: "boisson", label: "Boisson" },
  { key: "fume", label: "Fume" },
  { key: "tempsEcran", label: "Temps d'écran" },
  { key: "sommeil", label: "Sommeil" },
  { key: "stress", label: "Stress sur une échelle de 1 à 10" },
  { key: "frequenceEntrainement", label: "Fréquence d'entraînement par semaine" },
  { key: "brasFaible", label: "Bras faible" },
  { key: "jambeFaible", label: "Jambe faible" },
];

const DEFAULT_SERIES_COUNT = 4;
const WARMUP_SERIES_COUNT = 3;
const ENDSESSION_SERIES_COUNT = 3;

const DEFAULT_REPS = 12;
const DEFAULT_CHARGE = 10;
const WARMUP_DEFAULT_SECONDS = 50;
const ENDSESSION_DEFAULT_RESPIRATION = 4;

function isWarmupExercise(ex) {
  return !!ex && zoneLabel(ex.zone) === "Échauffement";
}

function isEndSessionExercise(ex) {
  return !!ex && zoneLabel(ex.zone) === "Étirements";
}

function makeEntries(exerciceIds, exercisesMap) {
  const entries = [];
  exerciceIds.forEach((exId) => {
    const ex = exercisesMap ? exercisesMap[exId] : null;
    const warmup = isWarmupExercise(ex);
    const endSession = isEndSessionExercise(ex);
    let count = DEFAULT_SERIES_COUNT;
    let repsDefault = DEFAULT_REPS;
    let chargeDefault = DEFAULT_CHARGE;
    if (warmup) {
      count = WARMUP_SERIES_COUNT;
      repsDefault = WARMUP_DEFAULT_SECONDS;
    } else if (endSession) {
      count = ENDSESSION_SERIES_COUNT;
      repsDefault = ENDSESSION_DEFAULT_RESPIRATION;
      chargeDefault = null;
    }
    for (let s = 1; s <= count; s++) {
      entries.push({ exerciceId: exId, serie: s, reps: repsDefault, charge: chargeDefault });
    }
  });
  return entries;
}

function formatDateFR(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function App() {
  const [role, setRole] = useState(null);
  const [roleLoaded, setRoleLoaded] = useState(false);

  const [clients, setClients] = useState(null);
  const [clientsLoaded, setClientsLoaded] = useState(false);
  const [clientId, setClientId] = useState(null);
  const [clientChoiceLoaded, setClientChoiceLoaded] = useState(false);

  const [library, setLibrary] = useState(null);
  const [libraryLoaded, setLibraryLoaded] = useState(false);

  const [sessions, setSessions] = useState(null);
  const [sessionsLoaded, setSessionsLoaded] = useState(false);

  const [profile, setProfile] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const [view, setView] = useState("suivi");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Load role (personal, per device)
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(ROLE_KEY, false);
        if (r && r.value) setRole(r.value);
      } catch (e) {}
      setRoleLoaded(true);
    })();
  }, []);

  // Load client list + library (shared), create defaults on first run
  useEffect(() => {
    (async () => {
      let cl = null;
      try {
        const r = await window.storage.get(CLIENTS_KEY, true);
        if (r && r.value) cl = JSON.parse(r.value);
      } catch (e) {}

      let lib = null;
      try {
        const r = await window.storage.get(LIBRARY_KEY, true);
        if (r && r.value) lib = JSON.parse(r.value);
      } catch (e) {}

      if (!cl || cl.length === 0) {
        cl = [{ id: "client1", name: "GG", email: "gg@example.com", pin: "0000" }];
        try { await window.storage.set(CLIENTS_KEY, JSON.stringify(cl), true); } catch (e) {}
        try {
          await window.storage.set(
            sessionsKey("client1"),
            JSON.stringify(DEFAULT_DATA.sessions),
            true
          );
        } catch (e) {}
      }

      if (!lib) {
        lib = {
          exercises: DEFAULT_DATA.exercises,
          seanceTypes: DEFAULT_DATA.seanceTypes,
          programs: DEFAULT_DATA.programs,
        };
        try { await window.storage.set(LIBRARY_KEY, JSON.stringify(lib), true); } catch (e) {}
      }

      setClients(cl);
      setLibrary(lib);
      setClientsLoaded(true);
      setLibraryLoaded(true);
    })();
  }, []);

  // Load personal client choice for this device
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(CLIENT_CHOICE_KEY, false);
        if (r && r.value) setClientId(r.value);
      } catch (e) {}
      setClientChoiceLoaded(true);
    })();
  }, []);

  // Load sessions whenever clientId changes
  useEffect(() => {
    if (!clientId) return;
    setSessionsLoaded(false);
    (async () => {
      let s = null;
      try {
        const r = await window.storage.get(sessionsKey(clientId), true);
        if (r && r.value) s = JSON.parse(r.value);
      } catch (e) {}
      if (!s) s = [];
      setSessions(s);
      setSessionsLoaded(true);
    })();
  }, [clientId]);

  // Load profile whenever clientId changes
  useEffect(() => {
    if (!clientId) return;
    setProfileLoaded(false);
    (async () => {
      let p = null;
      try {
        const r = await window.storage.get(profileKey(clientId), true);
        if (r && r.value) p = JSON.parse(r.value);
      } catch (e) {}
      if (!p) p = {};
      setProfile(p);
      setProfileLoaded(true);
    })();
  }, [clientId]);

  const chooseRole = async (r) => {
    setRole(r);
    try { await window.storage.set(ROLE_KEY, r, false); } catch (e) {}
  };
  const changeRole = () => setRole(null);

  const chooseClient = async (id) => {
    setClientId(id);
    try { await window.storage.set(CLIENT_CHOICE_KEY, id, false); } catch (e) {}
  };
  const changeClient = () => setClientId(null);

  const addClient = async (name, email, pin) => {
    const newClient = { id: uid("client"), name, email, pin };
    const newClients = [...(clients || []), newClient];
    setClients(newClients);
    try { await window.storage.set(CLIENTS_KEY, JSON.stringify(newClients), true); } catch (e) {}
    try { await window.storage.set(sessionsKey(newClient.id), JSON.stringify([]), true); } catch (e) {}
    await chooseClient(newClient.id);
    return newClient;
  };

  // Client-side identification: match by email + PIN, never exposes the client list
  const loginClient = (email, pin) => {
    const match = (clients || []).find(
      (c) => (c.email || "").trim().toLowerCase() === email.trim().toLowerCase()
    );
    if (!match) return { status: "not_found" };
    if (String(match.pin) !== String(pin)) return { status: "wrong_pin" };
    return { status: "ok", id: match.id };
  };

  const assignProgram = useCallback(async (programId) => {
    if (!clientId) return;
    const newClients = clients.map((c) =>
      c.id === clientId ? { ...c, programId: programId || null } : c
    );
    setClients(newClients);
    try { await window.storage.set(CLIENTS_KEY, JSON.stringify(newClients), true); } catch (e) {}
  }, [clientId, clients]);

  const persistLibrary = useCallback(async (newLib) => {
    setSaving(true);
    setLibrary(newLib);
    try {
      await window.storage.set(LIBRARY_KEY, JSON.stringify(newLib), true);
      setToast("Enregistré");
    } catch (e) {
      setToast("Erreur d'enregistrement, réessaie");
    }
    setSaving(false);
    setTimeout(() => setToast(null), 1800);
  }, []);

  const persistSessions = useCallback(async (newSessions) => {
    if (!clientId) return;
    setSaving(true);
    setSessions(newSessions);
    try {
      await window.storage.set(sessionsKey(clientId), JSON.stringify(newSessions), true);
      setToast("Enregistré");
    } catch (e) {
      setToast("Erreur d'enregistrement, réessaie");
    }
    setSaving(false);
    setTimeout(() => setToast(null), 1800);
  }, [clientId]);

  const persistProfile = useCallback(async (newProfile) => {
    if (!clientId) return;
    setSaving(true);
    setProfile(newProfile);
    try {
      await window.storage.set(profileKey(clientId), JSON.stringify(newProfile), true);
      setToast("Enregistré");
    } catch (e) {
      setToast("Erreur d'enregistrement, réessaie");
    }
    setSaving(false);
    setTimeout(() => setToast(null), 1800);
  }, [clientId]);

  const notReady =
    !roleLoaded || !clientsLoaded || !libraryLoaded || !clientChoiceLoaded;

  if (notReady) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner} />
        <div style={{ marginTop: 16, color: "#9CA3AF", fontFamily: FONT_BODY }}>Chargement du suivi…</div>
      </div>
    );
  }

  if (!role) {
    return <RoleSelect onChoose={chooseRole} />;
  }

  if (!clientId || !clients.find((c) => c.id === clientId)) {
    return (
      <ClientSelect
        clients={clients}
        role={role}
        onChoose={chooseClient}
        onAdd={addClient}
        onLogin={loginClient}
        onChangeRole={changeRole}
      />
    );
  }

  const activeClient = clients.find((c) => c.id === clientId);
  const data = library && sessions !== null ? { ...library, sessions } : null;

  return (
    <div style={styles.app}>
      <Header
        role={role}
        view={view}
        setView={setView}
        onChangeRole={changeRole}
        clientName={activeClient ? activeClient.name : ""}
        onChangeClient={changeClient}
        saving={saving}
      />
      <div style={styles.body}>
        {!data || !sessionsLoaded ? (
          <div style={{ ...styles.emptyState, padding: "60px 0" }}>Chargement des données du client…</div>
        ) : (
          <>
            {view === "profil" && (
              <ProfileView
                profile={profile}
                profileLoaded={profileLoaded}
                persistProfile={persistProfile}
                activeClient={activeClient}
              />
            )}
            {view === "suivi" && (
              <SuiviView
                data={data}
                persistSessions={persistSessions}
                role={role}
                activeClient={activeClient}
              />
            )}
            {view === "progression" && <ProgressionView data={data} />}
            {view === "programmes" && (
              <ProgrammesView
                data={data}
                persistLibrary={persistLibrary}
                role={role}
                activeClient={activeClient}
                assignProgram={assignProgram}
              />
            )}
            {view === "seances" && (
              <SeanceTypesView data={data} persistLibrary={persistLibrary} role={role} />
            )}
            {view === "exercices" && (
              <ExercisesView data={data} persistLibrary={persistLibrary} role={role} />
            )}
          </>
        )}
      </div>
      {toast && <div style={styles.toast}>{toast}</div>}
    </div>
  );
}

const FONT_DISPLAY = "'Space Grotesk', 'Arial Black', sans-serif";
const FONT_BODY = "'Inter', -apple-system, sans-serif";

const COLORS = {
  bg: "#0F0D0B",
  bg2: "#1A1613",
  card: "#211C18",
  cardBorder: "#3A2F26",
  accent: "#FF7A1A",
  accent2: "#FFB066",
  text: "#FAF8F5",
  textDim: "#C9BFB4",
  textFaint: "#8A7C6E",
  danger: "#FF6B6B",
};

function RoleSelect({ onChoose }) {
  return (
    <div style={{ ...styles.app, alignItems: "center", justifyContent: "center", display: "flex", minHeight: "100%" }}>
      <div style={{ maxWidth: 420, width: "100%", padding: 24, textAlign: "center" }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, letterSpacing: 3, color: COLORS.accent, marginBottom: 8, textTransform: "uppercase" }}>
          Philémon Musculation
        </div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: COLORS.text, margin: "0 0 8px 0", lineHeight: 1.15 }}>
          Qui consulte ce suivi ?
        </h1>
        <p style={{ color: COLORS.textDim, fontFamily: FONT_BODY, fontSize: 14, marginBottom: 32 }}>
          Ce choix reste mémorisé sur cet appareil.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button style={styles.roleBtn} onClick={() => onChoose("coach")}>
            <span style={{ fontSize: 20 }}>🎯</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, color: COLORS.bg }}>Je suis le coach</div>
              <div style={{ fontSize: 12, color: "#3D2410" }}>Remplir et gérer les programmes</div>
            </div>
          </button>
          <button style={{ ...styles.roleBtn, background: COLORS.card, border: `1px solid ${COLORS.cardBorder}` }} onClick={() => onChoose("client")}>
            <span style={{ fontSize: 20 }}>💪</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, color: COLORS.text }}>Je suis le client</div>
              <div style={{ fontSize: 12, color: COLORS.textDim }}>Suivre ma progression</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function ClientSelect({ clients, role, onChoose, onAdd, onLogin, onChangeRole }) {
  if (role === "coach") {
    return <CoachClientPicker clients={clients} onChoose={onChoose} onAdd={onAdd} onChangeRole={onChangeRole} />;
  }
  return <ClientLogin onLogin={onLogin} onAdd={onAdd} onChoose={onChoose} onChangeRole={onChangeRole} />;
}

function CoachClientPicker({ clients, onChoose, onAdd, onChangeRole }) {
  const [showAdd, setShowAdd] = useState(clients.length === 0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState(() => String(Math.floor(1000 + Math.random() * 9000)));

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const create = () => {
    if (!name.trim() || !emailValid || pin.length !== 4) return;
    onAdd(name.trim(), email.trim().toLowerCase(), pin);
  };

  return (
    <div style={{ ...styles.app, alignItems: "center", justifyContent: "center", display: "flex", minHeight: "100%" }}>
      <div style={{ maxWidth: 420, width: "100%", padding: 24 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, letterSpacing: 3, color: COLORS.accent, marginBottom: 8, textTransform: "uppercase", textAlign: "center" }}>
          Philémon Musculation
        </div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 24, color: COLORS.text, margin: "0 0 8px 0", textAlign: "center" }}>
          Quel client veux-tu suivre ?
        </h1>
        <p style={{ color: COLORS.textDim, fontFamily: FONT_BODY, fontSize: 13, marginBottom: 8, textAlign: "center" }}>
          Mémorisé sur cet appareil, modifiable à tout moment.
        </p>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <button style={styles.linkBtn} onClick={onChangeRole}>Je ne suis pas le coach, revenir en arrière</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {clients.map((c) => (
            <button key={c.id} style={styles.clientBtn} onClick={() => onChoose(c.id)}>
              <span style={{ width: 32, height: 32, borderRadius: "50%", background: COLORS.accent, color: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_DISPLAY, fontSize: 14, flexShrink: 0 }}>
                {c.name.slice(0, 1).toUpperCase()}
              </span>
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontFamily: FONT_BODY, fontSize: 14, color: COLORS.text, fontWeight: 600 }}>{c.name}</span>
                <span style={{ display: "block", fontSize: 11, color: COLORS.textDim }}>{c.email}</span>
                <span style={{ display: "block", fontSize: 11, color: COLORS.textFaint }}>Code d'accès client : {c.pin}</span>
              </span>
            </button>
          ))}
        </div>

        {!showAdd ? (
          <button style={styles.secondaryBtn} onClick={() => setShowAdd(true)}>+ Nouveau client</button>
        ) : (
          <div style={styles.card}>
            <label style={styles.fieldLabel}>Nom du client</label>
            <input
              style={styles.textInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Marie"
              autoFocus
            />
            <label style={styles.fieldLabel}>Adresse mail du client (identifiant de connexion)</label>
            <input
              style={styles.textInput}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="marie@exemple.com"
            />
            <label style={styles.fieldLabel}>Code d'accès à 4 chiffres (à communiquer au client)</label>
            <input
              style={styles.textInput}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              inputMode="numeric"
            />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              {clients.length > 0 && (
                <button style={styles.secondaryBtn} onClick={() => setShowAdd(false)}>Annuler</button>
              )}
              <button style={styles.primaryBtn} disabled={!name.trim() || !emailValid || pin.length !== 4} onClick={create}>
                Créer et sélectionner
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ClientLogin({ onLogin, onAdd, onChoose, onChangeRole }) {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [offerCreate, setOfferCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPin, setNewPin] = useState("");
  const [newPinConfirm, setNewPinConfirm] = useState("");

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const submit = () => {
    setError("");
    if (!emailValid || pin.length !== 4) {
      setError("Renseigne ton adresse mail et ton code à 4 chiffres.");
      return;
    }
    const result = onLogin(email.trim(), pin);
    if (result.status === "ok") {
      onChoose(result.id);
    } else if (result.status === "wrong_pin") {
      setError("Code incorrect.");
    } else {
      // not_found: offer to create a fresh profile with this email
      setOfferCreate(true);
    }
  };

  const create = () => {
    if (!newName.trim()) {
      setError("Renseigne ton prénom.");
      return;
    }
    if (newPin.length !== 4 || newPin !== newPinConfirm) {
      setError("Les deux codes doivent être identiques et faire 4 chiffres.");
      return;
    }
    onAdd(newName.trim(), email.trim().toLowerCase(), newPin);
  };

  if (offerCreate) {
    return (
      <div style={{ ...styles.app, alignItems: "center", justifyContent: "center", display: "flex", minHeight: "100%" }}>
        <div style={{ maxWidth: 380, width: "100%", padding: 24 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, letterSpacing: 3, color: COLORS.accent, marginBottom: 8, textTransform: "uppercase", textAlign: "center" }}>
            Philémon Musculation
          </div>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: COLORS.text, margin: "0 0 8px 0", textAlign: "center" }}>
            Aucun profil pour "{email.trim()}"
          </h1>
          <p style={{ color: COLORS.textDim, fontFamily: FONT_BODY, fontSize: 13, marginBottom: 20, textAlign: "center" }}>
            Si ton coach t'a déjà créé un profil, vérifie l'orthographe de ton adresse mail. Sinon, crée le tien.
          </p>
          <div style={styles.card}>
            <label style={styles.fieldLabel}>Prénom</label>
            <input style={styles.textInput} value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ex: Marie" autoFocus />
            <label style={styles.fieldLabel}>Choisis un code à 4 chiffres</label>
            <input style={styles.textInput} value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" />
            <label style={styles.fieldLabel}>Confirme le code</label>
            <input style={styles.textInput} value={newPinConfirm} onChange={(e) => setNewPinConfirm(e.target.value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" />
            {error && <div style={{ color: COLORS.danger, fontSize: 12, marginBottom: 10 }}>{error}</div>}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button style={styles.secondaryBtn} onClick={() => { setOfferCreate(false); setError(""); }}>Retour</button>
              <button style={styles.primaryBtn} disabled={!newName.trim() || newPin.length !== 4} onClick={create}>
                Créer mon profil
              </button>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button style={styles.linkBtn} onClick={onChangeRole}>Je suis le coach</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.app, alignItems: "center", justifyContent: "center", display: "flex", minHeight: "100%" }}>
      <div style={{ maxWidth: 380, width: "100%", padding: 24 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, letterSpacing: 3, color: COLORS.accent, marginBottom: 8, textTransform: "uppercase", textAlign: "center" }}>
          Philémon Musculation
        </div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 24, color: COLORS.text, margin: "0 0 8px 0", textAlign: "center" }}>
          Identifie-toi
        </h1>
        <p style={{ color: COLORS.textDim, fontFamily: FONT_BODY, fontSize: 13, marginBottom: 8, textAlign: "center" }}>
          Ton adresse mail et le code fournis par ton coach.
        </p>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <button style={styles.linkBtn} onClick={onChangeRole}>Je suis le coach</button>
        </div>
        <div style={styles.card}>
          <label style={styles.fieldLabel}>Adresse mail</label>
          <input style={styles.textInput} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="marie@exemple.com" autoFocus />
          <label style={styles.fieldLabel}>Code à 4 chiffres</label>
          <input
            style={styles.textInput}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            inputMode="numeric"
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          {error && <div style={{ color: COLORS.danger, fontSize: 12, marginBottom: 10 }}>{error}</div>}
          <button style={{ ...styles.primaryBtn, width: "100%" }} onClick={submit}>
            Accéder à mon suivi
          </button>
        </div>
      </div>
    </div>
  );
}

function Header({ role, view, setView, onChangeRole, clientName, onChangeClient, saving }) {
  const tabs = [
    { id: "profil", label: "Profil" },
    { id: "suivi", label: "Suivi" },
    { id: "progression", label: "Progression" },
    { id: "programmes", label: "Programmes" },
    { id: "seances", label: "Séances" },
    { id: "exercices", label: "Exercices" },
  ];
  return (
    <div style={styles.header}>
      <div style={styles.headerTop}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, letterSpacing: 2, color: COLORS.accent, textTransform: "uppercase" }}>
          Philémon Musculation
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {saving && <span style={{ fontSize: 11, color: COLORS.textFaint }}>Enregistrement…</span>}
          <span style={styles.roleBadge}>{role === "coach" ? "Coach" : "Client"}</span>
          <button style={styles.linkBtn} onClick={onChangeRole}>rôle</button>
          <span style={{ ...styles.roleBadge, background: "rgba(255,176,102,0.15)", color: COLORS.accent2 }}>{clientName}</span>
          <button style={styles.linkBtn} onClick={onChangeClient}>client</button>
        </div>
      </div>
      <div style={styles.tabRow}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setView(t.id)}
            style={{
              ...styles.tabBtn,
              color: view === t.id ? COLORS.bg : COLORS.textDim,
              background: view === t.id ? COLORS.accent : "transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function exMap(data) {
  const m = {};
  data.exercises.forEach((e) => (m[e.id] = e));
  return m;
}

const STANDARD_ZONES = ["WARM UP", "BAS DU CORPS", "HAUT DU CORPS", "CENTRE DU CORPS", "ETIREMENTS"];

function zoneLabel(zone) {
  if (!zone) return "Autre";
  const z = zone.trim().toUpperCase();
  if (z === "WARM UP") return "Échauffement";
  if (z === "ETIREMENTS" || z === "ÉTIREMENTS" || z === "FIN DE SEANCE" || z === "FIN DE SÉANCE") return "Étirements";
  return zone;
}

function exDisplayName(ex) {
  if (!ex) return "";
  const nom = ex.nom.replace(/\n/g, " ");
  return ex.groupe ? `${nom} (${ex.groupe.replace(/\n/g, " ")})` : nom;
}

// Groups a list of exercise ids into ordered [zoneLabel, exId[]] pairs,
// zones appearing in the order their first exercise is encountered,
// with Échauffement always pulled to the front and Étirements to the back.
function groupExIdsByZone(exIds, exercises) {
  const order = [];
  const byZone = {};
  exIds.forEach((exId) => {
    const ex = exercises[exId];
    const label = zoneLabel(ex ? ex.zone : null);
    if (!byZone[label]) {
      byZone[label] = [];
      order.push(label);
    }
    byZone[label].push(exId);
  });
  order.sort((a, b) => {
    if (a === "Échauffement") return -1;
    if (b === "Échauffement") return 1;
    if (a === "Étirements") return 1;
    if (b === "Étirements") return -1;
    return 0;
  });
  return order.map((label) => [label, byZone[label]]);
}

function ProfileView({ profile, profileLoaded, persistProfile, activeClient }) {
  const [local, setLocal] = useState(profile || {});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setLocal(profile || {});
    setDirty(false);
  }, [profile]);

  if (!profileLoaded) {
    return <div style={{ ...styles.emptyState, padding: "40px 0" }}>Chargement du profil…</div>;
  }

  const updateField = (key, value) => {
    setLocal((p) => ({ ...p, [key]: value }));
    setDirty(true);
  };

  return (
    <div>
      <div style={styles.rowBetween}>
        <h2 style={styles.h2}>Profil{activeClient ? ` — ${activeClient.name}` : ""}</h2>
        <button
          style={{ ...styles.primaryBtn, opacity: dirty ? 1 : 0.5 }}
          disabled={!dirty}
          onClick={() => {
            persistProfile(local);
            setDirty(false);
          }}
        >
          Enregistrer
        </button>
      </div>
      <p style={{ color: COLORS.textDim, fontSize: 13, marginBottom: 16 }}>
        Ces informations aident le coach à personnaliser le suivi. Modifiable par le coach comme par le client.
      </p>
      <div style={styles.card}>
        {PROFILE_FIELDS.map((f, i) => (
          <div key={f.key} style={{ marginBottom: i === PROFILE_FIELDS.length - 1 ? 0 : 16 }}>
            <label style={styles.fieldLabel}>{f.label}</label>
            <textarea
              value={local[f.key] || ""}
              onChange={(e) => updateField(f.key, e.target.value)}
              rows={f.key === "objectifs" || f.key === "presentSportif" || f.key === "passeSportif" ? 3 : 2}
              style={styles.textArea}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function SuiviView({ data, persistSessions, role, activeClient }) {
  const exercises = exMap(data);
  const [expanded, setExpanded] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [quickDate, setQuickDate] = useState(todayISO());
  const sessionsSorted = useMemo(
    () => [...data.sessions].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [data.sessions]
  );

  const updateSessionEntries = (sessionId, newEntries) => {
    const newSessions = data.sessions.map((s) => (s.id === sessionId ? { ...s, entries: newEntries } : s));
    persistSessions(newSessions);
  };

  const deleteSession = (sessionId) => {
    const newSessions = data.sessions.filter((s) => s.id !== sessionId);
    persistSessions(newSessions);
    setExpanded((cur) => (cur === sessionId ? null : cur));
  };

  const addSession = (session) => {
    const newSessions = [...data.sessions, session];
    persistSessions(newSessions);
    setShowNew(false);
    setExpanded(session.id);
  };

  const assignedProgram = activeClient ? data.programs.find((p) => p.id === activeClient.programId) : null;
  const stMap = {};
  data.seanceTypes.forEach((s) => (stMap[s.id] = s));

  const programNameForSeance = (seanceNom) => {
    if (!seanceNom) return null;
    const st = data.seanceTypes.find((s) => s.nom === seanceNom);
    if (!st) return null;
    const progs = data.programs.filter((p) => p.seanceTypeIds.includes(st.id));
    if (progs.length === 0) return null;
    return progs.map((p) => p.nom).join(" / ");
  };

  const startFromTemplate = (seanceType) => {
    const entries = makeEntries(seanceType.exerciceIds, exercises);
    addSession({ id: uid("se"), date: quickDate, seanceNom: seanceType.nom, entries });
  };

  return (
    <div>
      {assignedProgram && (
        <div style={{ ...styles.card, marginBottom: 16, borderColor: COLORS.accent }}>
          <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 10 }}>
            Programme en cours : <strong style={{ color: COLORS.accent }}>{assignedProgram.nom}</strong>
          </div>
          <label style={styles.fieldLabel}>Date de la séance</label>
          <input
            type="date"
            value={quickDate}
            onChange={(e) => setQuickDate(e.target.value)}
            style={{ ...styles.textInput, maxWidth: 200 }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
            {assignedProgram.seanceTypeIds.map((stId) => {
              const st = stMap[stId];
              if (!st) return null;
              return (
                <div key={stId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "8px 10px", background: COLORS.bg2, borderRadius: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{st.nom}</div>
                    <div style={{ fontSize: 11, color: COLORS.textDim, lineHeight: 1.6 }}>
                      {groupExIdsByZone(st.exerciceIds, exercises).map(([label, ids]) => (
                        <div key={label}>
                          <span style={{ color: COLORS.accent2, fontWeight: 600 }}>{label} : </span>
                          {ids.map((exId) => exDisplayName(exercises[exId])).filter(Boolean).join(" · ")}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button style={styles.secondaryBtn} onClick={() => startFromTemplate(st)}>Démarrer</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={styles.rowBetween}>
        <h2 style={styles.h2}>Séances enregistrées</h2>
        <button style={styles.primaryBtn} onClick={() => setShowNew(true)}>+ Nouvelle séance</button>
      </div>

      {showNew && (
        <NewSessionForm
          data={data}
          onCancel={() => setShowNew(false)}
          onSave={addSession}
        />
      )}

      {sessionsSorted.length === 0 && (
        <div style={styles.emptyState}>Aucune séance pour l'instant. Ajoute la première.</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sessionsSorted.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            exercises={exercises}
            allSessions={data.sessions}
            programName={programNameForSeance(session.seanceNom)}
            expanded={expanded === session.id}
            onToggle={() => setExpanded(expanded === session.id ? null : session.id)}
            onExpand={() => setExpanded(session.id)}
            onSave={(entries) => updateSessionEntries(session.id, entries)}
            onDelete={() => deleteSession(session.id)}
          />
        ))}
      </div>
    </div>
  );
}

function groupBySeries(entries) {
  const byEx = {};
  entries.forEach((e, idx) => {
    if (!byEx[e.exerciceId]) byEx[e.exerciceId] = [];
    byEx[e.exerciceId].push({ ...e, _idx: idx });
  });
  return byEx;
}

function SessionCard({ session, exercises, allSessions, programName, expanded, onToggle, onExpand, onSave, onDelete }) {
  const [local, setLocal] = useState(session.entries);
  const [dirty, setDirty] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [openConsignes, setOpenConsignes] = useState({});
  const [openVideo, setOpenVideo] = useState({});

  useEffect(() => {
    setLocal(session.entries);
    setDirty(false);
  }, [session.entries]);

  useEffect(() => {
    if (!expanded) setConfirmDelete(false);
  }, [expanded]);

  const grouped = groupBySeries(local);
  const exIds = Object.keys(grouped);
  const zoneGroups = groupExIdsByZone(exIds, exercises);

  // For each exercise/série in this session, find the most recent earlier
  // session that logged the same exercise/série, to show as a comparison.
  const previousValues = useMemo(() => {
    const earlierSessions = (allSessions || [])
      .filter((s) => s.id !== session.id && s.date < session.date)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
    const map = {};
    session.entries.forEach((e) => {
      const key = e.exerciceId + "_" + e.serie;
      if (map[key] !== undefined) return;
      for (const s of earlierSessions) {
        const match = s.entries.find(
          (en) => en.exerciceId === e.exerciceId && en.serie === e.serie && (en.reps != null || en.charge != null)
        );
        if (match) {
          map[key] = match;
          break;
        }
      }
    });
    return map;
  }, [allSessions, session.id, session.date, session.entries]);

  const updateField = (idx, field, value) => {
    const copy = local.map((e, i) => (i === idx ? { ...e, [field]: value === "" ? null : Number(value) } : e));
    setLocal(copy);
    setDirty(true);
  };

  const requestDelete = (e) => {
    e.stopPropagation();
    onExpand();
    setConfirmDelete(true);
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeaderRow} onClick={onToggle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: COLORS.text }}>
              {session.seanceNom && <span style={{ color: COLORS.accent }}>{session.seanceNom} — </span>}
              {formatDateFR(session.date)}
            </div>
            <div style={{ fontSize: 12, color: COLORS.textDim }}>
              {exIds.length} exercice{exIds.length > 1 ? "s" : ""}
              {programName && <span style={{ color: COLORS.accent2 }}> · {programName}</span>}
            </div>
          </div>
          <button
            style={styles.trashBtn}
            onClick={requestDelete}
            title="Supprimer la séance"
            aria-label="Supprimer la séance"
          >
            🗑️
          </button>
        </div>
        <span style={{ color: COLORS.textFaint, fontSize: 18, flexShrink: 0, marginLeft: 8 }}>{expanded ? "−" : "+"}</span>
      </div>

      {confirmDelete && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 12, padding: "10px 12px", background: "rgba(255,107,107,0.08)", border: `1px solid ${COLORS.danger}`, borderRadius: 8 }}>
          <span style={{ fontSize: 12, color: COLORS.text }}>Supprimer définitivement cette séance ?</span>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button style={styles.secondaryBtn} onClick={() => setConfirmDelete(false)}>Annuler</button>
            <button style={styles.dangerBtn} onClick={onDelete}>Supprimer</button>
          </div>
        </div>
      )}

      {expanded && (
        <div style={{ marginTop: 14 }}>
          {zoneGroups.map(([label, ids]) => (
            <div key={label} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, paddingBottom: 4, borderBottom: `1px solid ${COLORS.cardBorder}` }}>
                {label}
              </div>
              {ids.map((exId) => {
                const ex = exercises[exId];
                const rows = grouped[exId];
                const showConsignesBtn = ex && hasConsignes(ex);
                const showVideoBtn = ex && ex.videoUrl;
                const warmup = isWarmupExercise(ex);
                const endSession = isEndSessionExercise(ex);
                return (
                  <div key={exId} style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 13, color: COLORS.accent2, marginBottom: 6, fontFamily: FONT_BODY, fontWeight: 600 }}>
                      {ex ? exDisplayName(ex) : "Exercice"}
                      {warmup && <span style={{ color: COLORS.textFaint, fontWeight: 400, fontSize: 11 }}> — temps en secondes</span>}
                      {endSession && <span style={{ color: COLORS.textFaint, fontWeight: 400, fontSize: 11 }}> — respirations</span>}
                    </div>
                    {rows.map((row, rIdx) => {
                      const prev = previousValues[exId + "_" + row.serie];
                      return (
                      <div key={row._idx} style={styles.entryRow}>
                        <span style={styles.entryLabel}>Set {row.serie}</span>
                        <input
                          type="number"
                          value={row.reps ?? ""}
                          onChange={(e) => updateField(row._idx, "reps", e.target.value)}
                          placeholder={warmup ? "Sec." : endSession ? "Resp." : "Rép."}
                          style={styles.numInput}
                        />
                        <span style={styles.unitLabel}>{warmup ? '"' : endSession ? "resp" : "rep"}</span>
                        {!endSession && (
                          <>
                            <input
                              type="number"
                              value={row.charge ?? ""}
                              onChange={(e) => updateField(row._idx, "charge", e.target.value)}
                              placeholder="Kg"
                              style={styles.numInput}
                            />
                            <span style={styles.unitLabel}>kg</span>
                          </>
                        )}
                        {prev && (
                          <span style={styles.prevValue}>
                            Dernière fois : {prev.reps ?? "—"}
                            {warmup ? "s" : endSession ? " resp." : " rép."}
                            {!endSession && <> · {prev.charge ?? "—"} kg</>}
                          </span>
                        )}
                        {rIdx === 0 && showConsignesBtn && (
                          <button
                            style={{ ...styles.infoBtn, ...styles.infoBtnConsignes, ...(openConsignes[exId] ? styles.infoBtnActive : {}) }}
                            onClick={() => setOpenConsignes((p) => ({ ...p, [exId]: !p[exId] }))}
                            title="Voir les consignes"
                            aria-label="Voir les consignes"
                          >
                            ℹ️ Tips
                          </button>
                        )}
                        {rIdx === 0 && showVideoBtn && (
                          <button
                            style={{ ...styles.infoBtn, ...styles.infoBtnVideo, ...(openVideo[exId] ? styles.infoBtnActive : {}) }}
                            onClick={() => setOpenVideo((p) => ({ ...p, [exId]: !p[exId] }))}
                            title="Voir la vidéo"
                            aria-label="Voir la vidéo"
                          >
                            ▶️ Vidéo
                          </button>
                        )}
                      </div>
                      );
                    })}
                    {openConsignes[exId] && ex && <ConsignesPanel ex={ex} />}
                    {openVideo[exId] && ex && <VideoPanel url={ex.videoUrl} />}
                  </div>
                );
              })}
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, gap: 10 }}>
            <button style={styles.dangerLinkBtn} onClick={() => setConfirmDelete(true)}>Supprimer la séance</button>
            <button
              style={{ ...styles.primaryBtn, opacity: dirty ? 1 : 0.5 }}
              disabled={!dirty}
              onClick={() => {
                onSave(local);
                setDirty(false);
              }}
            >
              Enregistrer les modifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NewSessionForm({ data, onCancel, onSave }) {
  const [date, setDate] = useState(todayISO());
  const [seanceTypeId, setSeanceTypeId] = useState("");
  const [selectedExIds, setSelectedExIds] = useState([]);

  const applyTemplate = (stId) => {
    setSeanceTypeId(stId);
    const st = data.seanceTypes.find((s) => s.id === stId);
    if (st) setSelectedExIds(st.exerciceIds);
  };

  const toggleEx = (exId) => {
    setSelectedExIds((prev) => (prev.includes(exId) ? prev.filter((x) => x !== exId) : [...prev, exId]));
  };

  const save = () => {
    if (!date || selectedExIds.length === 0) return;
    const entries = makeEntries(selectedExIds, exMap(data));
    const st = data.seanceTypes.find((s) => s.id === seanceTypeId);
    onSave({ id: uid("se"), date, seanceNom: st ? st.nom : null, entries });
  };

  return (
    <div style={{ ...styles.card, marginBottom: 14 }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: COLORS.text, marginBottom: 12 }}>Nouvelle séance</div>
      <label style={styles.fieldLabel}>Date</label>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={styles.textInput} />

      <label style={styles.fieldLabel}>Type de séance (optionnel, pré-remplit les exercices)</label>
      <select value={seanceTypeId} onChange={(e) => applyTemplate(e.target.value)} style={styles.textInput}>
        <option value="">— Choisir —</option>
        {data.seanceTypes.map((st) => (
          <option key={st.id} value={st.id}>{st.nom}</option>
        ))}
      </select>

      <label style={styles.fieldLabel}>Exercices de la séance</label>
      <div style={styles.checklist}>
        {groupExIdsByZone(data.exercises.map((e) => e.id), exMap(data)).map(([label, ids]) => (
          <div key={label} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5, margin: "6px 0 4px" }}>
              {label}
            </div>
            {ids.map((exId) => {
              const ex = data.exercises.find((e) => e.id === exId);
              if (!ex) return null;
              return (
                <label key={ex.id} style={styles.checkItem}>
                  <input
                    type="checkbox"
                    checked={selectedExIds.includes(ex.id)}
                    onChange={() => toggleEx(ex.id)}
                  />
                  <span style={{ marginLeft: 8 }}>{exDisplayName(ex)}</span>
                </label>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
        <button style={styles.secondaryBtn} onClick={onCancel}>Annuler</button>
        <button style={styles.primaryBtn} onClick={save} disabled={selectedExIds.length === 0}>
          Créer la séance
        </button>
      </div>
    </div>
  );
}

function ProgressionView({ data }) {
  const zones = useMemo(() => {
    const seen = [];
    data.exercises.forEach((e) => {
      const label = zoneLabel(e.zone);
      if (!seen.includes(label)) seen.push(label);
    });
    seen.sort((a, b) => (a === "Échauffement" ? -1 : b === "Échauffement" ? 1 : 0));
    return seen;
  }, [data.exercises]);

  const [zone, setZone] = useState(zones[0] || "");
  const exercisesInZone = useMemo(
    () => data.exercises.filter((e) => zoneLabel(e.zone) === zone),
    [data.exercises, zone]
  );
  const [exId, setExId] = useState(exercisesInZone[0]?.id || "");

  const changeZone = (newZone) => {
    setZone(newZone);
    const first = data.exercises.find((e) => zoneLabel(e.zone) === newZone);
    setExId(first ? first.id : "");
  };

  const points = useMemo(() => {
    const rows = [];
    [...data.sessions]
      .sort((a, b) => (a.date > b.date ? 1 : -1))
      .forEach((s) => {
        const entries = s.entries.filter((e) => e.exerciceId === exId && (e.reps != null || e.charge != null));
        if (entries.length === 0) return;
        const bestReps = Math.max(...entries.map((e) => e.reps ?? 0));
        const bestCharge = Math.max(...entries.map((e) => e.charge ?? 0));
        rows.push({ date: formatDateFR(s.date), reps: bestReps || null, charge: bestCharge || null });
      });
    return rows;
  }, [data.sessions, exId]);

  const ex = data.exercises.find((e) => e.id === exId);

  return (
    <div>
      <h2 style={styles.h2}>Progression par exercice</h2>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px", minWidth: 180 }}>
          <label style={styles.fieldLabel}>Partie du corps</label>
          <select value={zone} onChange={(e) => changeZone(e.target.value)} style={styles.textInput}>
            {zones.map((z) => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: "1 1 200px", minWidth: 180 }}>
          <label style={styles.fieldLabel}>Exercice</label>
          <select value={exId} onChange={(e) => setExId(e.target.value)} style={styles.textInput}>
            {exercisesInZone.map((e) => (
              <option key={e.id} value={e.id}>{exDisplayName(e)}</option>
            ))}
          </select>
        </div>
      </div>

      {points.length === 0 ? (
        <div style={styles.emptyState}>Pas encore de données pour {ex ? ex.nom.replace(/\n/g, " ") : "cet exercice"}.</div>
      ) : (
        <>
          <div style={{ ...styles.card, marginTop: 16, height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={points} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid stroke={COLORS.cardBorder} strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke={COLORS.textFaint} tick={{ fontSize: 11, fill: COLORS.textDim }} />
                <YAxis yAxisId="left" stroke={COLORS.accent} tick={{ fontSize: 11, fill: COLORS.textDim }} />
                <YAxis yAxisId="right" orientation="right" stroke={COLORS.accent2} tick={{ fontSize: 11, fill: COLORS.textDim }} />
                <Tooltip contentStyle={{ background: COLORS.bg2, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line yAxisId="left" type="monotone" dataKey="reps" name="Répétitions" stroke={COLORS.accent} strokeWidth={2} dot={{ r: 3 }} connectNulls />
                <Line yAxisId="right" type="monotone" dataKey="charge" name="Charge (kg)" stroke={COLORS.accent2} strokeWidth={2} dot={{ r: 3 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ ...styles.card, marginTop: 14, padding: 0, overflow: "hidden" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Répétitions</th>
                  <th style={styles.th}>Charge (kg)</th>
                </tr>
              </thead>
              <tbody>
                {points.slice().reverse().map((p, i) => (
                  <tr key={i}>
                    <td style={styles.td}>{p.date}</td>
                    <td style={styles.td}>{p.reps ?? "—"}</td>
                    <td style={styles.td}>{p.charge ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function ProgrammesView({ data, persistLibrary, role, activeClient, assignProgram }) {
  const [showNewProgram, setShowNewProgram] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState(null);
  const isCoach = role === "coach";

  const stMap = {};
  data.seanceTypes.forEach((s) => (stMap[s.id] = s));
  const exMapLocal = exMap(data);

  const addProgram = (pr) => {
    const newLib = { ...data, programs: [...data.programs, { id: uid("pr"), ...pr }] };
    persistLibrary({ exercises: newLib.exercises, seanceTypes: newLib.seanceTypes, programs: newLib.programs });
    setShowNewProgram(false);
  };

  const updateProgram = (programId, updates) => {
    const newLib = {
      ...data,
      programs: data.programs.map((p) => (p.id === programId ? { ...p, ...updates } : p)),
    };
    persistLibrary({ exercises: newLib.exercises, seanceTypes: newLib.seanceTypes, programs: newLib.programs });
    setEditingProgramId(null);
  };

  return (
    <div>
      <div style={styles.rowBetween}>
        <h2 style={styles.h2}>Programmes</h2>
        {isCoach && (
          <button style={styles.primaryBtn} onClick={() => setShowNewProgram(true)}>+ Nouveau programme</button>
        )}
      </div>

      {isCoach && activeClient && (
        <div style={{ ...styles.card, marginBottom: 16, borderColor: COLORS.accent }}>
          <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 8 }}>
            Programme assigné à <strong style={{ color: COLORS.text }}>{activeClient.name}</strong>
          </div>
          <select
            value={activeClient.programId || ""}
            onChange={(e) => assignProgram(e.target.value)}
            style={{ ...styles.textInput, marginBottom: 0 }}
          >
            <option value="">— Aucun programme assigné —</option>
            {data.programs.map((pr) => (
              <option key={pr.id} value={pr.id}>{pr.nom}</option>
            ))}
          </select>
        </div>
      )}

      {!isCoach && activeClient && activeClient.programId && (
        <div style={{ ...styles.card, marginBottom: 16, borderColor: COLORS.accent }}>
          <div style={{ fontSize: 13, color: COLORS.textDim }}>
            Ton programme actuel : <strong style={{ color: COLORS.accent }}>{data.programs.find((p) => p.id === activeClient.programId)?.nom || "—"}</strong>
          </div>
        </div>
      )}

      {showNewProgram && (
        <NewProgramForm data={data} onCancel={() => setShowNewProgram(false)} onSave={addProgram} />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.programs.map((pr) => {
          const isAssigned = activeClient && activeClient.programId === pr.id;
          if (isCoach && editingProgramId === pr.id) {
            return (
              <EditProgramForm
                key={pr.id}
                data={data}
                program={pr}
                onCancel={() => setEditingProgramId(null)}
                onSave={(updates) => updateProgram(pr.id, updates)}
              />
            );
          }
          return (
          <div key={pr.id} style={{ ...styles.card, borderColor: isAssigned ? COLORS.accent : COLORS.cardBorder }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: COLORS.text }}>{pr.nom}</div>
                {isAssigned && <span style={styles.pill}>Assigné</span>}
              </div>
              {isCoach && (
                <button style={styles.linkBtn} onClick={() => setEditingProgramId(pr.id)}>Modifier</button>
              )}
            </div>
            {pr.seanceTypeIds.map((stId) => {
              const st = stMap[stId];
              if (!st) return null;
              return (
                <div key={stId} style={{ marginBottom: 8, paddingLeft: 10, borderLeft: `2px solid ${COLORS.cardBorder}` }}>
                  <div style={{ fontSize: 13, color: COLORS.accent2, fontWeight: 600 }}>{st.nom}</div>
                  <div style={{ fontSize: 12, color: COLORS.textDim, lineHeight: 1.6 }}>
                    {groupExIdsByZone(st.exerciceIds, exMapLocal).map(([label, ids]) => (
                      <div key={label}>
                        <span style={{ color: COLORS.textFaint }}>{label} : </span>
                        {ids.map((exId) => exDisplayName(exMapLocal[exId])).filter(Boolean).join(" · ")}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          );
        })}
      </div>
    </div>
  );
}

function seanceCategory(nom) {
  const n = nom.trim().toLowerCase();
  if (n.startsWith("full body")) return "Full body";
  if (n.startsWith("lower")) return "Lower";
  if (n.startsWith("upper")) return "Upper";
  return "Autres";
}

const SEANCE_CATEGORY_ORDER = ["Full body", "Lower", "Upper", "Autres"];

function groupSeanceTypesByCategory(seanceTypes) {
  const byCat = {};
  seanceTypes.forEach((st) => {
    const cat = seanceCategory(st.nom);
    if (!byCat[cat]) byCat[cat] = [];
    byCat[cat].push(st);
  });
  return SEANCE_CATEGORY_ORDER.map((cat) => [cat, byCat[cat] || []]).filter(([, list]) => list.length > 0);
}

function SeanceTypesView({ data, persistLibrary, role }) {
  const [showNewSeance, setShowNewSeance] = useState(false);
  const [editingSeanceTypeId, setEditingSeanceTypeId] = useState(null);
  const isCoach = role === "coach";

  const addSeanceType = (st) => {
    const newLib = { ...data, seanceTypes: [...data.seanceTypes, { id: uid("st"), ...st }] };
    persistLibrary({ exercises: newLib.exercises, seanceTypes: newLib.seanceTypes, programs: newLib.programs });
    setShowNewSeance(false);
  };

  const updateSeanceType = (seanceTypeId, updates) => {
    const newLib = {
      ...data,
      seanceTypes: data.seanceTypes.map((s) => (s.id === seanceTypeId ? { ...s, ...updates } : s)),
    };
    persistLibrary({ exercises: newLib.exercises, seanceTypes: newLib.seanceTypes, programs: newLib.programs });
    setEditingSeanceTypeId(null);
  };

  const grouped = groupSeanceTypesByCategory(data.seanceTypes);

  return (
    <div>
      <div style={styles.rowBetween}>
        <h2 style={styles.h2}>Séances</h2>
        {isCoach && (
          <button style={styles.primaryBtn} onClick={() => setShowNewSeance(true)}>+ Nouveau type</button>
        )}
      </div>
      {isCoach && showNewSeance && (
        <NewSeanceTypeForm data={data} onCancel={() => setShowNewSeance(false)} onSave={addSeanceType} />
      )}
      {grouped.map(([category, list]) => (
        <div key={category} style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, paddingBottom: 4, borderBottom: `1px solid ${COLORS.cardBorder}` }}>
            {category}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {list.map((st) =>
              isCoach && editingSeanceTypeId === st.id ? (
                <EditSeanceTypeForm
                  key={st.id}
                  data={data}
                  seanceType={st}
                  onCancel={() => setEditingSeanceTypeId(null)}
                  onSave={(updates) => updateSeanceType(st.id, updates)}
                />
              ) : (
                <div key={st.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "8px 12px", background: COLORS.bg2, borderRadius: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{st.nom}</div>
                    <div style={{ fontSize: 11, color: COLORS.textFaint }}>{st.exerciceIds.length} exercice{st.exerciceIds.length > 1 ? "s" : ""}</div>
                  </div>
                  {isCoach && (
                    <button style={styles.linkBtn} onClick={() => setEditingSeanceTypeId(st.id)}>Modifier</button>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const CONSIGNE_FIELDS = [
  { key: "positionDepart", label: "Position de départ" },
  { key: "positionArrivee", label: "Position d'arrivée" },
  { key: "mouvement", label: "Mouvement" },
  { key: "respiration", label: "Respiration" },
];

function hasConsignes(ex) {
  if (!ex || !ex.consignes) return false;
  return CONSIGNE_FIELDS.some((f) => (ex.consignes[f.key] || "").trim());
}

function ConsignesFields({ value, onChange }) {
  const v = value || {};
  return (
    <>
      {CONSIGNE_FIELDS.map((f) => (
        <div key={f.key}>
          <label style={styles.fieldLabel}>{f.label}</label>
          <textarea
            style={styles.textArea}
            rows={2}
            value={v[f.key] || ""}
            onChange={(e) => onChange({ ...v, [f.key]: e.target.value })}
          />
        </div>
      ))}
    </>
  );
}

function ConsignesPanel({ ex }) {
  return (
    <div style={styles.consignesPanel}>
      {CONSIGNE_FIELDS.map((f) =>
        (ex.consignes[f.key] || "").trim() ? (
          <div key={f.key} style={{ marginBottom: 6 }}>
            <span style={{ color: COLORS.accent2, fontWeight: 600 }}>{f.label} : </span>
            <span style={{ color: COLORS.textDim }}>{ex.consignes[f.key]}</span>
          </div>
        ) : null
      )}
    </div>
  );
}

function getYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

function VideoPanel({ url }) {
  const id = getYouTubeId(url);
  if (!id) {
    return <div style={{ ...styles.consignesPanel, color: COLORS.textFaint }}>Lien vidéo invalide.</div>;
  }
  const watchUrl = `https://www.youtube.com/watch?v=${id}`;
  const thumbUrl = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  return (
    <a
      href={watchUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={styles.videoWrapper}
      title="Regarder sur YouTube"
    >
      <img src={thumbUrl} alt="Miniature de la vidéo" style={styles.videoThumb} />
      <span style={styles.videoPlayOverlay}>▶</span>
      <span style={styles.videoOpenLabel}>Regarder sur YouTube ↗</span>
    </a>
  );
}

function ExercisesView({ data, persistLibrary, role }) {
  const [showNewExercise, setShowNewExercise] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState(null);
  const [openConsignes, setOpenConsignes] = useState({});
  const [openVideo, setOpenVideo] = useState({});
  const isCoach = role === "coach";

  const addExercise = (ex) => {
    const newLib = { ...data, exercises: [...data.exercises, { id: uid("ex"), ...ex }] };
    persistLibrary({ exercises: newLib.exercises, seanceTypes: newLib.seanceTypes, programs: newLib.programs });
    setShowNewExercise(false);
  };

  const updateExercise = (exId, updates) => {
    const newLib = {
      ...data,
      exercises: data.exercises.map((e) => (e.id === exId ? { ...e, ...updates } : e)),
    };
    persistLibrary({ exercises: newLib.exercises, seanceTypes: newLib.seanceTypes, programs: newLib.programs });
    setEditingExerciseId(null);
  };

  return (
    <div>
      <div style={styles.rowBetween}>
        <h2 style={styles.h2}>Catalogue d'exercices</h2>
        {isCoach && (
          <button style={styles.primaryBtn} onClick={() => setShowNewExercise(true)}>+ Nouvel exercice</button>
        )}
      </div>
      {isCoach && showNewExercise && (
        <NewExerciseForm data={data} onCancel={() => setShowNewExercise(false)} onSave={addExercise} />
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {groupExIdsByZone(data.exercises.map((e) => e.id), exMap(data)).map(([label, ids]) => (
          <div key={label} style={styles.card}>
            <div style={{ fontSize: 11, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
              {label}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {ids.map((exId) => {
                const ex = data.exercises.find((e) => e.id === exId);
                if (!ex) return null;
                if (isCoach && editingExerciseId === exId) {
                  return (
                    <EditExerciseForm
                      key={ex.id}
                      data={data}
                      exercise={ex}
                      onCancel={() => setEditingExerciseId(null)}
                      onSave={(updates) => updateExercise(ex.id, updates)}
                    />
                  );
                }
                const showConsignesBtn = hasConsignes(ex);
                const showVideoBtn = !!ex.videoUrl;
                return (
                  <div key={ex.id} style={{ padding: "8px 12px", background: COLORS.bg2, borderRadius: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{ex.nom.replace(/\n/g, " ")}</div>
                        <div style={{ fontSize: 11, color: COLORS.textFaint }}>{ex.groupe}</div>
                      </div>
                      {isCoach && (
                        <button style={styles.linkBtn} onClick={() => setEditingExerciseId(ex.id)}>Modifier</button>
                      )}
                    </div>
                    {(showConsignesBtn || showVideoBtn) && (
                      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                        {showConsignesBtn && (
                          <button
                            style={{ ...styles.infoBtn, ...styles.infoBtnConsignes, ...(openConsignes[ex.id] ? styles.infoBtnActive : {}) }}
                            onClick={() => setOpenConsignes((p) => ({ ...p, [ex.id]: !p[ex.id] }))}
                          >
                            ℹ️ Tips
                          </button>
                        )}
                        {showVideoBtn && (
                          <button
                            style={{ ...styles.infoBtn, ...styles.infoBtnVideo, ...(openVideo[ex.id] ? styles.infoBtnActive : {}) }}
                            onClick={() => setOpenVideo((p) => ({ ...p, [ex.id]: !p[ex.id] }))}
                          >
                            ▶️ Vidéo
                          </button>
                        )}
                      </div>
                    )}
                    {openConsignes[ex.id] && <ConsignesPanel ex={ex} />}
                    {openVideo[ex.id] && <VideoPanel url={ex.videoUrl} />}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, color: COLORS.textDim, marginTop: 12 }}>
        {data.exercises.length} exercices au catalogue
      </div>
    </div>
  );
}

function NewProgramForm({ data, onCancel, onSave }) {
  const [nom, setNom] = useState("");
  const [ids, setIds] = useState([]);
  const toggle = (id) => setIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  return (
    <div style={{ ...styles.card, marginBottom: 14 }}>
      <label style={styles.fieldLabel}>Nom du programme</label>
      <input style={styles.textInput} value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex: Programme prise de masse" />
      <label style={styles.fieldLabel}>Séances incluses</label>
      <div style={styles.checklist}>
        {data.seanceTypes.map((st) => (
          <label key={st.id} style={styles.checkItem}>
            <input type="checkbox" checked={ids.includes(st.id)} onChange={() => toggle(st.id)} />
            <span style={{ marginLeft: 8 }}>{st.nom}</span>
          </label>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
        <button style={styles.secondaryBtn} onClick={onCancel}>Annuler</button>
        <button style={styles.primaryBtn} disabled={!nom || ids.length === 0} onClick={() => onSave({ nom, seanceTypeIds: ids })}>
          Créer
        </button>
      </div>
    </div>
  );
}

function EditProgramForm({ data, program, onCancel, onSave }) {
  const [nom, setNom] = useState(program.nom);
  const [ids, setIds] = useState(program.seanceTypeIds);
  const toggle = (id) => setIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  return (
    <div style={{ ...styles.card, borderColor: COLORS.accent2 }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: COLORS.text, marginBottom: 12 }}>Modifier le programme</div>
      <label style={styles.fieldLabel}>Nom du programme</label>
      <input style={styles.textInput} value={nom} onChange={(e) => setNom(e.target.value)} />
      <label style={styles.fieldLabel}>Séances incluses</label>
      <div style={styles.checklist}>
        {data.seanceTypes.map((st) => (
          <label key={st.id} style={styles.checkItem}>
            <input type="checkbox" checked={ids.includes(st.id)} onChange={() => toggle(st.id)} />
            <span style={{ marginLeft: 8 }}>{st.nom}</span>
          </label>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
        <button style={styles.secondaryBtn} onClick={onCancel}>Annuler</button>
        <button style={styles.primaryBtn} disabled={!nom || ids.length === 0} onClick={() => onSave({ nom, seanceTypeIds: ids })}>
          Enregistrer
        </button>
      </div>
    </div>
  );
}

function NewSeanceTypeForm({ data, onCancel, onSave }) {
  const [nom, setNom] = useState("");
  const [ids, setIds] = useState([]);
  const toggle = (id) => setIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const exercisesMap = exMap(data);
  return (
    <div style={{ ...styles.card, marginTop: 10 }}>
      <label style={styles.fieldLabel}>Nom du type de séance</label>
      <input style={styles.textInput} value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex: Full body E" />
      <label style={styles.fieldLabel}>Exercices inclus</label>
      <div style={styles.checklist}>
        {groupExIdsByZone(data.exercises.map((e) => e.id), exercisesMap).map(([label, exIds]) => (
          <div key={label} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5, margin: "6px 0 4px" }}>
              {label}
            </div>
            {exIds.map((exId) => {
              const ex = exercisesMap[exId];
              return (
                <label key={ex.id} style={styles.checkItem}>
                  <input type="checkbox" checked={ids.includes(ex.id)} onChange={() => toggle(ex.id)} />
                  <span style={{ marginLeft: 8 }}>{exDisplayName(ex)}</span>
                </label>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
        <button style={styles.secondaryBtn} onClick={onCancel}>Annuler</button>
        <button style={styles.primaryBtn} disabled={!nom} onClick={() => onSave({ nom, exerciceIds: ids })}>
          Créer
        </button>
      </div>
    </div>
  );
}

function EditSeanceTypeForm({ data, seanceType, onCancel, onSave }) {
  const [nom, setNom] = useState(seanceType.nom);
  const [ids, setIds] = useState(seanceType.exerciceIds);
  const toggle = (id) => setIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const exercisesMap = exMap(data);
  return (
    <div style={{ ...styles.card, borderColor: COLORS.accent2 }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: COLORS.text, marginBottom: 12 }}>Modifier la séance</div>
      <label style={styles.fieldLabel}>Nom du type de séance</label>
      <input style={styles.textInput} value={nom} onChange={(e) => setNom(e.target.value)} />
      <label style={styles.fieldLabel}>Exercices inclus</label>
      <div style={styles.checklist}>
        {groupExIdsByZone(data.exercises.map((e) => e.id), exercisesMap).map(([label, exIds]) => (
          <div key={label} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5, margin: "6px 0 4px" }}>
              {label}
            </div>
            {exIds.map((exId) => {
              const ex = exercisesMap[exId];
              return (
                <label key={ex.id} style={styles.checkItem}>
                  <input type="checkbox" checked={ids.includes(ex.id)} onChange={() => toggle(ex.id)} />
                  <span style={{ marginLeft: 8 }}>{exDisplayName(ex)}</span>
                </label>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
        <button style={styles.secondaryBtn} onClick={onCancel}>Annuler</button>
        <button style={styles.primaryBtn} disabled={!nom} onClick={() => onSave({ nom, exerciceIds: ids })}>
          Enregistrer
        </button>
      </div>
    </div>
  );
}

function NewExerciseForm({ data, onCancel, onSave }) {
  const [nom, setNom] = useState("");
  const [consignes, setConsignes] = useState({});
  const [videoUrl, setVideoUrl] = useState("");

  const uniqueZones = [...new Set([...STANDARD_ZONES, ...data.exercises.map((e) => e.zone).filter(Boolean)])];
  const uniqueGroupes = [...new Set(data.exercises.map((e) => e.groupe).filter(Boolean))].sort();

  const [zone, setZone] = useState(uniqueZones[0] || "");
  const [zoneCustom, setZoneCustom] = useState("");
  const [groupe, setGroupe] = useState(uniqueGroupes[0] || "");
  const [groupeCustom, setGroupeCustom] = useState("");

  const NEW_VALUE = "__new__";
  const finalZone = zone === NEW_VALUE ? zoneCustom.trim() : zone;
  const finalGroupe = groupe === NEW_VALUE ? groupeCustom.trim() : groupe;

  return (
    <div style={{ ...styles.card, marginTop: 10 }}>
      <label style={styles.fieldLabel}>Nom de l'exercice</label>
      <input style={styles.textInput} value={nom} onChange={(e) => setNom(e.target.value)} />

      <label style={styles.fieldLabel}>Zone</label>
      <select style={styles.textInput} value={zone} onChange={(e) => setZone(e.target.value)}>
        {uniqueZones.map((z) => (
          <option key={z} value={z}>{zoneLabel(z)}</option>
        ))}
        <option value={NEW_VALUE}>+ Nouvelle zone…</option>
      </select>
      {zone === NEW_VALUE && (
        <input
          style={styles.textInput}
          value={zoneCustom}
          onChange={(e) => setZoneCustom(e.target.value)}
          placeholder="Ex: BAS DU CORPS"
        />
      )}

      <label style={styles.fieldLabel}>Groupe musculaire</label>
      <select style={styles.textInput} value={groupe} onChange={(e) => setGroupe(e.target.value)}>
        {uniqueGroupes.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
        <option value={NEW_VALUE}>+ Nouveau groupe…</option>
      </select>
      {groupe === NEW_VALUE && (
        <input
          style={styles.textInput}
          value={groupeCustom}
          onChange={(e) => setGroupeCustom(e.target.value)}
          placeholder="Ex: Quadriceps"
        />
      )}

      <div style={{ marginTop: 4, marginBottom: 6, fontSize: 11, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5 }}>
        Tips (optionnel)
      </div>
      <ConsignesFields value={consignes} onChange={setConsignes} />

      <label style={styles.fieldLabel}>Lien vidéo YouTube (optionnel)</label>
      <input
        style={styles.textInput}
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="https://www.youtube.com/watch?v=..."
      />

      <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
        <button style={styles.secondaryBtn} onClick={onCancel}>Annuler</button>
        <button
          style={styles.primaryBtn}
          disabled={!nom || !finalZone || !finalGroupe}
          onClick={() => onSave({ nom, zone: finalZone, groupe: finalGroupe, consignes, videoUrl: videoUrl.trim() })}
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}

function EditExerciseForm({ data, exercise, onCancel, onSave }) {
  const [nom, setNom] = useState(exercise.nom);
  const [consignes, setConsignes] = useState(exercise.consignes || {});
  const [videoUrl, setVideoUrl] = useState(exercise.videoUrl || "");

  const uniqueZones = [...new Set([...STANDARD_ZONES, ...data.exercises.map((e) => e.zone).filter(Boolean)])];
  const uniqueGroupes = [...new Set(data.exercises.map((e) => e.groupe).filter(Boolean))].sort();

  const [zone, setZone] = useState(exercise.zone || uniqueZones[0] || "");
  const [zoneCustom, setZoneCustom] = useState("");
  const [groupe, setGroupe] = useState(exercise.groupe || uniqueGroupes[0] || "");
  const [groupeCustom, setGroupeCustom] = useState("");

  const NEW_VALUE = "__new__";
  const finalZone = zone === NEW_VALUE ? zoneCustom.trim() : zone;
  const finalGroupe = groupe === NEW_VALUE ? groupeCustom.trim() : groupe;

  return (
    <div style={{ ...styles.card, borderColor: COLORS.accent2 }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: COLORS.text, marginBottom: 12 }}>Modifier l'exercice</div>
      <label style={styles.fieldLabel}>Nom de l'exercice</label>
      <input style={styles.textInput} value={nom} onChange={(e) => setNom(e.target.value)} />

      <label style={styles.fieldLabel}>Zone</label>
      <select style={styles.textInput} value={zone} onChange={(e) => setZone(e.target.value)}>
        {uniqueZones.map((z) => (
          <option key={z} value={z}>{zoneLabel(z)}</option>
        ))}
        <option value={NEW_VALUE}>+ Nouvelle zone…</option>
      </select>
      {zone === NEW_VALUE && (
        <input
          style={styles.textInput}
          value={zoneCustom}
          onChange={(e) => setZoneCustom(e.target.value)}
          placeholder="Ex: BAS DU CORPS"
        />
      )}

      <label style={styles.fieldLabel}>Groupe musculaire</label>
      <select style={styles.textInput} value={groupe} onChange={(e) => setGroupe(e.target.value)}>
        {uniqueGroupes.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
        <option value={NEW_VALUE}>+ Nouveau groupe…</option>
      </select>
      {groupe === NEW_VALUE && (
        <input
          style={styles.textInput}
          value={groupeCustom}
          onChange={(e) => setGroupeCustom(e.target.value)}
          placeholder="Ex: Quadriceps"
        />
      )}

      <div style={{ marginTop: 4, marginBottom: 6, fontSize: 11, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5 }}>
        Tips (optionnel)
      </div>
      <ConsignesFields value={consignes} onChange={setConsignes} />

      <label style={styles.fieldLabel}>Lien vidéo YouTube (optionnel)</label>
      <input
        style={styles.textInput}
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="https://www.youtube.com/watch?v=..."
      />

      <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
        <button style={styles.secondaryBtn} onClick={onCancel}>Annuler</button>
        <button
          style={styles.primaryBtn}
          disabled={!nom || !finalZone || !finalGroupe}
          onClick={() => onSave({ nom, zone: finalZone, groupe: finalGroupe, consignes, videoUrl: videoUrl.trim() })}
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}

const styles = {
  app: {
    fontFamily: FONT_BODY,
    background: COLORS.bg,
    color: COLORS.text,
    minHeight: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  loadingScreen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 300,
    background: COLORS.bg,
    borderRadius: 12,
  },
  spinner: {
    width: 28,
    height: 28,
    border: `3px solid ${COLORS.cardBorder}`,
    borderTopColor: COLORS.accent,
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  header: {
    padding: "16px 20px",
    borderBottom: `1px solid ${COLORS.cardBorder}`,
    background: COLORS.bg2,
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    flexWrap: "wrap",
    gap: 8,
  },
  roleBadge: {
    fontSize: 11,
    padding: "3px 10px",
    borderRadius: 20,
    background: "rgba(255,122,26,0.15)",
    color: COLORS.accent,
    fontWeight: 600,
    letterSpacing: 0.5,
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: COLORS.textFaint,
    fontSize: 12,
    cursor: "pointer",
    textDecoration: "underline",
  },
  tabRow: {
    display: "flex",
    gap: 6,
  },
  tabBtn: {
    border: "none",
    borderRadius: 8,
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: FONT_BODY,
  },
  body: {
    padding: 20,
  },
  h2: {
    fontFamily: FONT_DISPLAY,
    fontSize: 18,
    color: COLORS.text,
    margin: "0 0 14px 0",
  },
  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    flexWrap: "wrap",
    gap: 10,
  },
  card: {
    background: COLORS.card,
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: 12,
    padding: 16,
  },
  cardHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },
  primaryBtn: {
    background: COLORS.accent,
    color: COLORS.bg,
    border: "none",
    borderRadius: 8,
    padding: "9px 16px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: FONT_BODY,
  },
  secondaryBtn: {
    background: "transparent",
    color: COLORS.text,
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: 8,
    padding: "9px 16px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: FONT_BODY,
  },
  dangerBtn: {
    background: COLORS.danger,
    color: "#2A0E0E",
    border: "none",
    borderRadius: 8,
    padding: "9px 16px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: FONT_BODY,
  },
  dangerLinkBtn: {
    background: "none",
    border: "none",
    color: COLORS.danger,
    fontSize: 12,
    cursor: "pointer",
    fontFamily: FONT_BODY,
    padding: 0,
  },
  trashBtn: {
    background: "rgba(255,107,107,0.12)",
    border: `1px solid rgba(255,107,107,0.35)`,
    color: COLORS.danger,
    fontSize: 16,
    cursor: "pointer",
    padding: "6px 10px",
    borderRadius: 8,
    flexShrink: 0,
    lineHeight: 1,
  },
  roleBtn: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "16px 18px",
    borderRadius: 12,
    border: "none",
    background: COLORS.accent,
    cursor: "pointer",
  },
  clientBtn: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 14px",
    borderRadius: 10,
    border: `1px solid ${COLORS.cardBorder}`,
    background: COLORS.card,
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
  },
  emptyState: {
    color: COLORS.textFaint,
    fontSize: 13,
    padding: "30px 0",
    textAlign: "center",
  },
  entryRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "nowrap",
    gap: 5,
    marginBottom: 6,
    overflowX: "auto",
    paddingBottom: 2,
  },
  prevValue: {
    fontSize: 12,
    color: COLORS.accent2,
    opacity: 0.75,
    marginLeft: 8,
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  infoBtn: {
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
    marginLeft: 4,
    padding: "6px 10px",
    lineHeight: 1,
    flexShrink: 0,
    borderRadius: 8,
    fontFamily: FONT_BODY,
    whiteSpace: "nowrap",
  },
  infoBtnConsignes: {
    background: "rgba(255,176,102,0.14)",
    border: `1px solid rgba(255,176,102,0.5)`,
    color: COLORS.accent2,
  },
  infoBtnVideo: {
    background: "rgba(255,122,26,0.14)",
    border: `1px solid rgba(255,122,26,0.5)`,
    color: COLORS.accent,
  },
  infoBtnActive: {
    background: COLORS.accent,
    borderColor: COLORS.accent,
    color: COLORS.bg,
  },
  consignesPanel: {
    marginTop: 8,
    marginBottom: 4,
    padding: "10px 12px",
    background: COLORS.bg2,
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: 8,
    fontSize: 12,
  },
  videoWrapper: {
    position: "relative",
    display: "block",
    width: "100%",
    paddingTop: "56.25%",
    height: 0,
    overflow: "hidden",
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 4,
    border: `1px solid ${COLORS.cardBorder}`,
    background: "#000",
    textDecoration: "none",
  },
  videoThumb: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: 0.75,
  },
  videoPlayOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "rgba(255,122,26,0.9)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    paddingLeft: 4,
  },
  videoOpenLabel: {
    position: "absolute",
    bottom: 8,
    right: 10,
    fontSize: 11,
    color: "#fff",
    background: "rgba(0,0,0,0.55)",
    padding: "3px 8px",
    borderRadius: 6,
  },
  entryLabel: {
    fontSize: 12,
    color: COLORS.textDim,
    width: 34,
    flexShrink: 0,
  },
  unitLabel: {
    fontSize: 12,
    color: COLORS.textFaint,
    flexShrink: 0,
  },
  numInput: {
    width: 58,
    flexShrink: 0,
    background: COLORS.bg2,
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: 6,
    padding: "6px 6px",
    color: COLORS.text,
    fontSize: 13,
    fontFamily: FONT_BODY,
  },
  textInput: {
    width: "100%",
    background: COLORS.bg2,
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: 8,
    padding: "9px 12px",
    color: COLORS.text,
    fontSize: 13,
    fontFamily: FONT_BODY,
    marginBottom: 12,
    boxSizing: "border-box",
  },
  textArea: {
    width: "100%",
    background: COLORS.bg2,
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: 8,
    padding: "9px 12px",
    color: COLORS.text,
    fontSize: 13,
    fontFamily: FONT_BODY,
    boxSizing: "border-box",
    resize: "vertical",
  },
  fieldLabel: {
    display: "block",
    fontSize: 12,
    color: COLORS.textDim,
    marginBottom: 6,
    marginTop: 4,
  },
  checklist: {
    maxHeight: 220,
    overflowY: "auto",
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  checkItem: {
    display: "flex",
    alignItems: "center",
    fontSize: 13,
    padding: "5px 2px",
    color: COLORS.text,
    cursor: "pointer",
  },
  pill: {
    fontSize: 12,
    padding: "5px 10px",
    borderRadius: 20,
    background: COLORS.bg2,
    border: `1px solid ${COLORS.cardBorder}`,
    color: COLORS.textDim,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    fontSize: 11,
    color: COLORS.textFaint,
    padding: "10px 14px",
    borderBottom: `1px solid ${COLORS.cardBorder}`,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  td: {
    fontSize: 13,
    padding: "9px 14px",
    borderBottom: `1px solid ${COLORS.cardBorder}`,
    color: COLORS.text,
  },
  toast: {
    position: "fixed",
    bottom: 16,
    left: "50%",
    transform: "translateX(-50%)",
    background: COLORS.accent,
    color: COLORS.bg,
    padding: "8px 18px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
  },
};
