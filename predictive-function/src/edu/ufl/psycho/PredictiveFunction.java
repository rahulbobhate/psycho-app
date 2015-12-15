/**
 * 
 */
package edu.ufl.psycho;

import java.io.FileNotFoundException;
import java.io.FileReader;

import com.google.gson.Gson;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;

import edu.ufl.psycho.model.JsonObject;

/**
 * @author Rahul
 *
 */
public class PredictiveFunction
{    
    public static void main(String[] args) throws JsonSyntaxException, JsonIOException, FileNotFoundException
    {
        Gson gson = new Gson();
        JsonObject jsonObject = gson.fromJson(new FileReader("data.json"), JsonObject.class);
        
        calculateSomatoForm(jsonObject);
    }

    /**
     * @param jsonObject
     */
    private static void calculateSomatoForm(JsonObject jsonObject)
    {
        double somatoFormQuotient = jsonObject.receptiviti_scores.raw_scores.social_skills;
        somatoFormQuotient += jsonObject.receptiviti_scores.raw_scores.neuroticism;
        somatoFormQuotient += jsonObject.receptiviti_scores.raw_scores.insecure;
        somatoFormQuotient += jsonObject.receptiviti_scores.raw_scores.depression;
        somatoFormQuotient += jsonObject.receptiviti_scores.raw_scores.brooding;
        somatoFormQuotient += jsonObject.receptiviti_scores.raw_scores.hostile;        
        
        somatoFormQuotient/=6;
        
        System.out.println("Somato-Form Quotient: " + somatoFormQuotient);
    }
}
