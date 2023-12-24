# Application examples

{% tabs %}
{% tab label="Generate `myapp` in `apps` directory" %}

```shell
nx g @codeware-sthlm/nx-payload:application myapp --directory=apps/myapp
```

{% /tab %}
{% tab label="Apply tags" %}

```shell
nx g @codeware-sthlm/nx-payload:application myapp --directory=apps/myapp --tags=scope:apps,type:app
```

{% /tab %}
{% /tabs %}
