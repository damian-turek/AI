<?php
namespace App\Service;

use App\Exception\ConfigException;
use App\Exception\FrameworkException;

class Templating
{
    public function render(string $template, ?array $params = []): string
    {
        ob_start();
        extract($params);

        // Zamiana slasha na separator katalogów
        $template = str_replace('/', DIRECTORY_SEPARATOR, $template);

        // Sprawdzamy, czy rozszerzenie .html.php już istnieje, jeśli nie, dodajemy je
        if (substr($template, -9) !== '.html.php') {
            $template .= '.html.php';
        }

        $path = __DIR__
            . DIRECTORY_SEPARATOR . '..'
            . DIRECTORY_SEPARATOR . '..'
            . DIRECTORY_SEPARATOR . 'templates'
            . DIRECTORY_SEPARATOR . $template;

        // Sprawdzamy, czy plik istnieje
        if (!file_exists($path)) {
            throw new \App\Exception\FrameworkException("Template file {$path} not found.");
        }

        require $path;
        $html = ob_get_clean();

        return $html;
    }



}
