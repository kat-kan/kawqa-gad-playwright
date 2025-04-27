# Table of Contents

**2024-11-18_1** [Explicitly state regular user type as createHeaders() function parameter](#explicitly-state-regular-user-type)  
**2025-01-27_1** [Prefix fix for commits after code review](#commits-after-code-review)
**2025-04-14_1** [URLs as variable in pages](#urls-in-pages)

# Decisions

## Explicitly state `regular` user type as `createHeaders()` function parameter <a id="explicitly-state-regular-user-type"></a>

### Decision: The user type in the tests has to be explicitly stated regardless of the type

**ID**: 2024-11-18_1  
**Source**: Kaw-QA meeting

### Description

The `createHeaders()` function from `src/helpers/api/create-token.helper` file has parameter with default value `regular`. Nevertheless, it would be more comprehensible (especially for new Kaw-QA contributors) to explicitly state the user type in the tests.

## Prefix `fix` for commits after code review <a id="commits-after-code-review"></a>

### Decision: Commits made after code review should have type: `fix` and can have a scope

**ID**: 2025-01-27_1
**Source**: Kaw-QA meeting

### Description

The scope is optional. Examples:

- `fix: remove unnecessary import`
- `fix(api): move helper to different package`

### Notes

The decision entered to [CONTRIBUTING.md](../CONTRIBUTING.md)

## URLs as variable in pages<a id="urls-in-pages"></a>

### Decision: URLs should be declared as variables in POM

**ID**: 2025-04-14_1
**Source**: Kaw-QA meeting

### Description

Entering URLs as variables in POM improves test readability and allows to change URL as required in a single place.

### Examples

#### ✅ GOOD

```typescript
await page.goto(gamesPage.url);
```

#### ❌ BAD

```typescript
await page.goto('/practice/simple-multiple-elements-no-ids.html');
```
