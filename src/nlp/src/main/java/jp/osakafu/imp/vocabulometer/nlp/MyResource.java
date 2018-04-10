package jp.osakafu.imp.vocabulometer.nlp;

import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;
import java.util.Map;

/**
 * Root resource (exposed at "lemmatize" path)
 */
@Path("/lemmatize")
public class MyResource {

    /**
     * Method handling HTTP GET requests. The returned object will be sent
     * to the client as "text/plain" media type.
     *
     * @return String that will be returned as a text/plain response.
     */
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public String getIt(@FormParam("text") String text) {
        try {
            Lemmatizer lemmatizer = new Lemmatizer(ModelProvider.getPosPipeline());
            List<Map.Entry<String, String>> lemmas = lemmatizer.lemmatize(text);

            FilterPipeline pipeline = new FilterPipeline();
            pipeline.add(
                    new StopwordFilter(ModelProvider.getStopWords()),
                    new NERFilter(text, ModelProvider.getNerClassifier()),
                    new RegexFilter("^-?\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$|^\\.\\d\\d$")
            );

            lemmas = pipeline.apply(lemmas);

            JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
            for (Map.Entry<String, String> lemma : lemmas) {
                arrayBuilder.add(Json.createObjectBuilder()
                        .add("raw", lemma.getKey())
                        .add("lemma", lemma.getValue())
                        .build());
            }

            return Json.createObjectBuilder().add("result", arrayBuilder).build().toString();
        } catch (Exception e) {
            e.printStackTrace();
            return e.getMessage();
        }
    }
}
