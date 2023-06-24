export const formulize = (ids, amounts) => {

    let formula = "";

    for (let i = 0; i < ids.length; i++) {
        formula = formula + ((i === 0) ? "" : " + ") 
                + `${(amounts[i] === 1 ? "" : amounts[i]+"\u00D7")}[ ${ids[i]} ]`;
    }

    return formula;
}

export const reactionFormula = (reaction) => {

    const { inIds, inAmounts, outIds, outAmounts } = reaction;

    const input = formulize(inIds, inAmounts);

    const output = formulize(outIds, outAmounts);

    return input + " \u2192 " + output;
}

export const multiliedReactionFormula = (multiplier, reaction) => {
    
    let { inIds, inAmounts, outIds, outAmounts } = reaction;

    inAmounts = inAmounts.map((amount) => multiplier * amount);

    outAmounts = outAmounts.map((amount) => multiplier * amount);

    const input = formulize(inIds, inAmounts);

    const output = formulize(outIds, outAmounts);

    return input + " \u2192 " + output;
}