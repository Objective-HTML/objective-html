
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
	<define  name=name>
		Ness
	</define>
	<print>{name}</print>
</objective>
```

  

## Conditions

  

```html
<objective>
	<define  name=toggle>
		true
	</define>
	<if  toggle>
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
	<function  name=message  msg>
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

## Variable use

 > In general case.
```html
<objective>
	<define name=name>
		User
	</define>
	<print>
		{'Hello ' + name}
	</print>
</objective>
```

> In functions call.
```html
<objective>
	<function  name=test  arg1  arg2>
		<return>
			{arg1 * arg2}
		</return>
	</function>
	<define name=number>
		{1}
	</define>
	<test {number} {5}></test>
</objective>
```

## Modules

> Exportation

```html
<objective>
	<export>
		<function  name=test  arg1  arg2>
			<return>
				{arg1 * arg2}
			</return>
		</function>
		<define  name=coucou>
			hello
		</define>
	</export>
</objective>
```

> Importation
```html
<objective>
	<!-- Importing Mathematics library -->
	<import  src=./math  name=math></import>
	<print>
		<math::test {5} {4}></math::test>
	</print>
	<print>
		{math::coucou}
	</print>
</objective>
```

> Javascript modules
```html
<objective>
	<!-- Importing Mathematics library -->
	<import  src=fs  name=fs></import>
	<print>
		<fs::readFileSync filepath UTF-8></fs::readFileSync>
	</print>
</objective>
```