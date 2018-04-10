package jp.osakafu.imp.vocabulometer.nlp.data;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class LemmaListData {
    public LemmaData[] result;

    public LemmaListData() {

    }

    public List<String> toList() {
        if (this.result == null) {
            return Collections.emptyList();
        }

        return Arrays.stream(this.result)
                .map(l -> l.lemma)
                .collect(Collectors.toList());
    }
}