/**
 * 
 */
package edu.ufl.psycho.model;

import com.google.gson.annotations.SerializedName;

import edu.ufl.psycho.ReceptivitiScores;

/**
 * @author Rahul
 *
 */
public class JsonObject
{
    @SerializedName("liwc_scores")
    public LiwcScore liwc_score;   
    
    @SerializedName("receptiviti_scores")
    public ReceptivitiScores receptiviti_scores;
}
