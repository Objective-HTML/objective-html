# Objective HTML
> Objective HTML is a programming language which allow you to use HTML style syntax.
The mainly advantage of Objective HTML is that it's easy to learn.

## Hello world program
```html
<objective>
	<print>
		Hello world
	</print>
</objective>
```

## Variable declaration

```html
<objective>
	<define name=name>
		Ness
	</define>
	<print>{name}</print>
</objective>
```

## Conditions

```html
<objective>
	<define name=toggle>
		true
	</define>
	<if toggle>
		<print>
			Variable set on true.
		</print>
	</if>
	<else>
		<print>
			Variable set on false.
		</print>
	</else>
</objective>
```

## Functions

```html
<objective>
	<function name=message msg>	
		<print>
			{msg}
		</print>
	</function>
	
	<message>Hello world</message>
</objective>
```

## Comments

```html
<objective>
	<!-- Log "Hello world" -->
	<print>
		Hello world
	</print>
</objective>
```