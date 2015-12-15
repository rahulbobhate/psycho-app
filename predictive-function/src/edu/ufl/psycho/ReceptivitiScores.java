/**
 * 
 */
package edu.ufl.psycho;

import com.google.gson.annotations.SerializedName;

import edu.ufl.psycho.model.Percentiles;
import edu.ufl.psycho.model.RawScores;

/**
 * @author Rahul
 *
 */
public class ReceptivitiScores
{
    @SerializedName("percentiles")
    public Percentiles percentiles;
    
    @SerializedName("raw_scores")
    public RawScores raw_scores;
}
