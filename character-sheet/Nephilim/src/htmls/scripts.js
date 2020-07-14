
    // functions
    const updateRulingVal = () => {
        getSectionIDs("repeating_rulings", rullingsArray => {
            rullingsArray = rullingsArray.map(id => `repeating_rulings_${id}_ruleBreak`);

            getAttrs(rullingsArray, (values) => {
                let bonus = 0;
                Object.keys(values).forEach((key) => {
                    if (values[key] === "0") {
                        bonus += 1;
                    }
                });
                setAttrs({
                    kabOrdoBonusVal: bonus
                })
            })
        });
    };

    const updateMetamorphosisVal = () => {
        getSectionIDs("repeating_metamorphosis", metamorphosisArray => {
            metamorphosisArray = metamorphosisArray.map(id => `repeating_metamorphosis_${id}_metaPerm`);

            getAttrs(metamorphosisArray, (values) => {
                let bonus = 0;
                Object.keys(values).forEach((key) => {
                    if (values[key] === "0") {
                        bonus += 1;
                    }
                });
                setAttrs({
                    metaBonusVal: bonus
                })
            })
        });
    };

    // setup page on open
    on("sheet:opened", function() {
        console.log("Sheet opened, JS is running");
        // set up character elements section
        getSectionIDs("repeating_metamorphosis", metamorphosisArray => {
            metamorphosisArray = metamorphosisArray.map(id => `repeating_metamorphosis_${id}_metaPerm`);

            getAttrs(metamorphosisArray, (values) => {
                let bonus = 0;
                Object.keys(values).forEach((key) => {
                    if (values[key] === "0") {
                        bonus += 1;
                    }
                });
                setAttrs({
                    metaBonusVal: bonus
                });
            });
        });
        // set up veil
        getAttrs(["kaMoon"], (values) => {
           if (values.kaMoon >= 10) {
               setAttrs({veilValue: 2})
           } else if (values.kaMoon >= 5) {
               setAttrs({veilValue: 1})
           } else {
               setAttrs({veilValue: 0})
           }
        });

        // set up damage Bonus
        getAttrs(["kaFire"], (values) => {
           if (values.kaFire >= 10) {
               setAttrs({damageBonusValue: 2})
           } else if (values.kaFire >= 5) {
               setAttrs({damageBonusValue: 1})
           } else {
               setAttrs({damageBonusValue: 0})
           }
        });

        // set up Metamorphosis
        updateMetamorphosisVal();

        // set up Kabbale elements section
        updateRulingVal();

    });

    // Change Page
    const buttonList = ["tab1","tab2","tab3", "tab4", "tab5"];
    buttonList.forEach(button => {
        on(`clicked:${button}`, () => {
            setAttrs({
                sheetTab: button
            });
        });
    });

    // Character Page
    on("remove:repeating_metamorphosis change:repeating_metamorphosis", function(eventInfo) {
        updateMetamorphosisVal();
    });

    on("change:kaEarth", function(eventInfo) {
        getAttrs(["kaEarth"], (values) => {
           if (parseInt(values.kaEarth) >= 10) {
               setAttrs({
                   optionLifePhysical: "2"
               })
           } else if (parseInt(values.kaEarth) >= 5) {
               setAttrs({
                   optionLifePhysical: "1"
               })
           } else {
               setAttrs({
                   optionLifePhysical: "0"
               })
           }
        });
    });

    // Magic Page

    // Alchemy Page
    const updatePopo = (popoId) => {
        getAttrs([`${popoId}_alchPopoKa1`, `${popoId}_alchPopoKa2`, `${popoId}_alchPopoConstruct`], (values) => {
            let construct;
            let ka1;
            let ka2;
            Object.keys(values).forEach(key => {
                if(key.includes("alchPopoKa1")) {
                    ka1 = values[key]
                }
                else if(key.includes("alchPopoKa2")) {
                    ka2 = values[key]
                }
                else {
                    construct = values[key]
                }
            });
            const tool1 = `alchTool${construct}${ka1}`;
            const tool2 = `alchTool${construct}${ka2}`;

            getAttrs([tool1, tool2], (toolValues) => {
                let arr = Object.values(toolValues).map(val => parseInt(val));
                let min = Math.min(...arr);
                if(min === Infinity) {
                    min = 0;
                }
                const rollValueId = `${popoId}_alchPopoRollValue`;
                let updatedPopo = {};
                updatedPopo[rollValueId] = `(${min}+@{alchPopoCircle}-@{alchPopoDegree})`;
                setAttrs(updatedPopo);
            });

        });
    };

    on("change:repeating_popos", (eventInfo) => {
        updatePopo(eventInfo.triggerName);
    });

    const tools = ["Athanor", "Retort", "Crucible", "Aludel", "Alembic"];
    const elements = ["Fire", "Water", "Air", "Earth", "Moon"];

    tools.forEach(tool => {
       elements.forEach(element => {
           on(`change:alchTool${tool}${element}`, (eventInfo) => {
            getSectionIDs("popos", (ids) => {
                ids.forEach(id => {
                    updatePopo(`repeating_popos_${id}`);
                })
            })
        })
       })
    });

    // Kabbale Page
    on("remove:repeating_rulings change:repeating_rulings", (eventInfo) => {
        updateRulingVal();
    });

    on("change:repeating_invocations:kabInvWorld", (eventInfo) => {
        getAttrs(["kabWorld"], (values) => {
            if (values.kabWorld === eventInfo.newValue) {
                setAttrs({
                    "repeating_invocations_kabInvRollValue" : "(@{kabInvKa}+@{kabInvSephirah}+@{kabOrdoBonusVal})"
                });
            }
            else {
                setAttrs({
                    "repeating_invocations_kabInvRollValue" : "(@{kabInvKa}+@{kabInvSephirah})"
                });
            }
        });
    });

    // Equipement page
    on("change:repeating_weapons", (eventInfo) => {
        console.log(eventInfo);
    });