/**
 * 
 */
package edu.ufl.psycho.model;

import javax.annotation.Generated;

import com.google.gson.annotations.SerializedName;

/**
 * @author Rahul
 *
 */
public class LiwcScore
{
    @SerializedName("wc")
    public int wc;
    @SerializedName("sixLtr")
    public double sixLtr;
    @SerializedName("clout")
    public double clout;
    @SerializedName("wps")
    public double wps;
    @SerializedName("analytic")
    public double analytic;
    @SerializedName("tone")
    public double tone;
    @SerializedName("dic")
    public double dic;
    @SerializedName("authentic")
    public double authentic;
    @SerializedName("categories")
    public Categories categories;
}