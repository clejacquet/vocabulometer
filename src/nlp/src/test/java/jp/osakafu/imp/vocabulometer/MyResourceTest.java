package jp.osakafu.imp.vocabulometer;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Form;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import edu.stanford.nlp.ling.SentenceUtils;
import jp.osakafu.imp.vocabulometer.nlp.data.LemmaListData;
import jp.osakafu.imp.vocabulometer.nlp.Main;
import org.glassfish.grizzly.http.server.HttpServer;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.*;

import static org.junit.Assert.assertEquals;

import static org.junit.Assert.fail;

public class MyResourceTest {

    private HttpServer server;
    private WebTarget target;

    @Before
    public void setUp() throws Exception {
        // start the server
        server = Main.startServer();
        // create the client
        Client c = ClientBuilder.newClient();

        // uncomment the following line if you want to enable
        // support for JSON in the client (you also have to uncomment
        // dependency on jersey-media-json module in pom.xml and Main.startServer())
        // --
        // c.configuration().enable(new org.glassfish.jersey.media.json.JsonJaxbFeature());

        System.out.println(Main.BASE_URI);
        target = c.target(Main.BASE_URI);
    }

    @After
    public void tearDown() throws Exception {
        server.stop();
    }

    /**
     * Test to see that the message "Got it!" is sent in the response.
     */
    @Test
    public void testGetIt() {
        Form form = new Form();
        form.param("text", "Hello world, I'm Clement, nice to meet you.");

        Entity<Form> postBody = Entity.form(form);

        Response responseMsg = target
                .path("lemmatize")
                .request(MediaType.APPLICATION_FORM_URLENCODED)
                .accept(MediaType.APPLICATION_JSON)
                .post(postBody);

        System.out.println("STATUS: " + responseMsg.getStatus());

        if (responseMsg.getStatus() != 200) {
            System.out.println(responseMsg.readEntity(String.class));
            fail();
        }

        LemmaListData lemmaListData = responseMsg.readEntity(LemmaListData.class);

        assertEquals("hello world nice meet", SentenceUtils.listToString(lemmaListData.toList()));
    }
}
