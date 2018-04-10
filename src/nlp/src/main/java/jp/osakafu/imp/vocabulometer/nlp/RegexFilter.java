package jp.osakafu.imp.vocabulometer.nlp;

import java.util.List;
import java.util.Map;
import java.util.function.UnaryOperator;
import java.util.stream.Collectors;

class RegexFilter implements UnaryOperator<List<Map.Entry<String, String>>> {
    private EasyRegex easyRegex;

    RegexFilter(String pattern) {
        this.easyRegex = new EasyRegex(pattern);
    }

    @Override
    public List<Map.Entry<String, String>> apply(List<Map.Entry<String, String>> words) {
        return words
                .stream()
                .filter(w -> this.easyRegex.not_match(w.getValue()))
                .collect(Collectors.toList());
    }
}
