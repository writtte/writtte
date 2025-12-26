CC = gcc
TARGET = inspector
CFLAGS = -Wall -Wextra -std=c11
LDFLAGS = -framework ApplicationServices -framework CoreFoundation

SOURCES = main.c
OBJECTS = $(SOURCES:.c=.o)

all: $(TARGET)

$(TARGET): $(OBJECTS)
	@echo "linking $(TARGET)..."
	$(CC) $(CFLAGS) -o $(TARGET) $(OBJECTS) $(LDFLAGS)
	@echo "build successful!"

%.o: %.c
	@echo "compiling $<..."
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	@echo "cleaning build artifacts..."
	rm -f $(OBJECTS) $(TARGET)
	@echo "clean complete!"

run: $(TARGET)
	@echo "running $(TARGET)..."
	./$(TARGET)

start:
	./$(TARGET)

rebuild: clean all

.PHONY: all clean build run start rebuild
